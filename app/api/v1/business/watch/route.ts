import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkRateLimit, jsonError, corsHeaders, handleOptions, safeJsonParse, validateWebhookUrl, parseNumericId } from '@/lib/auth';
import { addWatch, getWatches, removeWatch } from '@/lib/watch-store';

export function OPTIONS(req: NextRequest) { return handleOptions(req); }

function getCustomerId(req: NextRequest): string {
  return req.headers.get('x-rapidapi-user') || req.headers.get('x-api-key') || 'direct';
}

// POST /api/v1/business/watch — add company to monitoring
// Body: { "companyId": 514713370, "webhookUrl": "https://example.com/hook" }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const [body, parseError] = await safeJsonParse(req);
  if (parseError) return parseError;

  const { companyId, webhookUrl } = body!;

  if (!companyId || !webhookUrl) {
    return jsonError('Provide { "companyId": NUMBER, "webhookUrl": "URL" }', 400, 'MISSING_PARAM');
  }

  // Validate companyId is a valid number
  if (typeof companyId !== 'number' || !Number.isFinite(companyId) || companyId <= 0) {
    return jsonError('companyId must be a positive number', 400, 'INVALID_PARAM');
  }

  // Validate webhookUrl against SSRF
  if (typeof webhookUrl !== 'string') {
    return jsonError('webhookUrl must be a string', 400, 'INVALID_PARAM');
  }
  const urlError = validateWebhookUrl(webhookUrl);
  if (urlError) {
    return jsonError(urlError, 400, 'INVALID_URL');
  }

  const customerId = getCustomerId(req);
  const entry = addWatch(Number(companyId), webhookUrl, customerId);

  return NextResponse.json({
    success: true,
    data: entry,
    message: `Monitoring company ${companyId}. You will receive POST webhooks when status changes.`,
  }, { headers: corsHeaders(req.headers.get('origin')) });
}

// GET /api/v1/business/watch — list your watches
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const customerId = getCustomerId(req);
  const watches = getWatches(customerId);

  return NextResponse.json({
    success: true,
    data: { total: watches.length, watches },
  }, { headers: corsHeaders(req.headers.get('origin')) });
}

// DELETE /api/v1/business/watch?id=WATCH_ID
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const watchId = new URL(req.url).searchParams.get('id');
  if (!watchId) return jsonError('Provide ?id=WATCH_ID', 400, 'MISSING_PARAM');

  // Validate watchId format
  if (!/^watch_\d+_\d+$/.test(watchId)) {
    return jsonError('Invalid watch ID format', 400, 'INVALID_PARAM');
  }

  // Ownership check: only allow deleting own watches
  const customerId = getCustomerId(req);
  const myWatches = getWatches(customerId);
  const ownsWatch = myWatches.some((w) => w.id === watchId);
  if (!ownsWatch) {
    return jsonError('Watch not found or not owned by you', 404, 'NOT_FOUND');
  }

  const removed = removeWatch(watchId);

  return NextResponse.json({
    success: true,
    removed,
  }, { headers: corsHeaders(req.headers.get('origin')) });
}

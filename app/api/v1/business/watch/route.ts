import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, jsonError, corsHeaders } from '@/lib/auth';
import { addWatch, getWatches, removeWatch } from '@/lib/watch-store';

// POST /api/v1/business/watch — add company to monitoring
// Body: { "companyId": 514713370, "webhookUrl": "https://example.com/hook" }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');

  const body = await req.json();
  const { companyId, webhookUrl } = body;

  if (!companyId || !webhookUrl) {
    return jsonError('Provide { "companyId": NUMBER, "webhookUrl": "URL" }', 400, 'MISSING_PARAM');
  }

  try {
    new URL(webhookUrl);
  } catch {
    return jsonError('Invalid webhookUrl — must be a valid URL', 400, 'INVALID_URL');
  }

  const customerId = req.headers.get('x-rapidapi-user') || req.headers.get('x-api-key') || 'direct';
  const entry = addWatch(Number(companyId), webhookUrl, customerId);

  return NextResponse.json({
    success: true,
    data: entry,
    message: `Monitoring company ${companyId}. You will receive POST webhooks when status changes.`,
  }, { headers: corsHeaders() });
}

// GET /api/v1/business/watch — list your watches
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');

  const customerId = req.headers.get('x-rapidapi-user') || req.headers.get('x-api-key') || 'direct';
  const watches = getWatches(customerId);

  return NextResponse.json({
    success: true,
    data: { total: watches.length, watches },
  }, { headers: corsHeaders() });
}

// DELETE /api/v1/business/watch?id=WATCH_ID
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');

  const watchId = new URL(req.url).searchParams.get('id');
  if (!watchId) return jsonError('Provide ?id=WATCH_ID', 400, 'MISSING_PARAM');

  const removed = removeWatch(watchId);

  return NextResponse.json({
    success: true,
    removed,
  }, { headers: corsHeaders() });
}

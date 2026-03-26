import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkRateLimit, jsonError, corsHeaders } from '@/lib/auth';
import { addWatch, getWatches, removeWatch } from '@/lib/watch-store';

// POST /api/v1/business/watch — add company to monitoring
// Body: { "companyId": 514713370, "webhookUrl": "https://example.com/hook" }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const body = await req.json();
  const { companyId, webhookUrl } = body;

  if (!companyId || !webhookUrl) {
    return jsonError('Provide { "companyId": NUMBER, "webhookUrl": "URL" }', 400, 'MISSING_PARAM');
  }

  // Validate webhook URL — prevent SSRF
  try {
    const parsed = new URL(webhookUrl);
    if (parsed.protocol !== 'https:') {
      return jsonError('webhookUrl must use HTTPS', 400, 'INVALID_URL');
    }
    const host = parsed.hostname;
    // Block private/internal IPs
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' ||
        host.startsWith('10.') || host.startsWith('192.168.') || host.startsWith('172.') ||
        host === '169.254.169.254' || host.endsWith('.internal') || host.endsWith('.local')) {
      return jsonError('webhookUrl cannot point to private/internal addresses', 400, 'INVALID_URL');
    }
  } catch {
    return jsonError('Invalid webhookUrl — must be a valid HTTPS URL', 400, 'INVALID_URL');
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
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

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
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const watchId = new URL(req.url).searchParams.get('id');
  if (!watchId) return jsonError('Provide ?id=WATCH_ID', 400, 'MISSING_PARAM');

  const removed = removeWatch(watchId);

  return NextResponse.json({
    success: true,
    removed,
  }, { headers: corsHeaders() });
}

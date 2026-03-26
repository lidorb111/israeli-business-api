import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkRateLimit, jsonError, corsHeaders, handleOptions, sanitizeQuery } from '@/lib/auth';
import { queryCompanies } from '@/lib/data-gov';

export function OPTIONS(req: NextRequest) { return handleOptions(req); }

// GET /api/v1/business/autocomplete?q=גוג
// Returns compact results optimized for dropdown/typeahead
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const q = sanitizeQuery(new URL(req.url).searchParams.get('q'), 100);
  if (!q || q.length < 2) {
    return jsonError('Provide ?q=TERM (minimum 2 characters)', 400, 'MISSING_PARAM');
  }

  const limit = Math.min(Math.max(Number(new URL(req.url).searchParams.get('limit') || 10) || 10, 1), 20);

  try {
    const data = await queryCompanies({ name: q, limit });
    const suggestions = data.result.records.map((r: Record<string, unknown>) => ({
      id: r['מספר חברה'],
      name: r['שם חברה'],
      nameEn: r['שם באנגלית'] || null,
      status: r['סטטוס חברה'],
      city: r['שם עיר'] || null,
    }));

    return NextResponse.json({
      success: true,
      data: { query: q, total: data.result.total, suggestions },
    }, { headers: corsHeaders(req.headers.get('origin')) });
  } catch {
    return jsonError('Failed to fetch suggestions', 502, 'UPSTREAM_ERROR');
  }
}

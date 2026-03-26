import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkRateLimit, jsonError, corsHeaders } from '@/lib/auth';
import { queryCompanies, mapRecord } from '@/lib/data-gov';

// POST /api/v1/business/bulk
// Body: { "ids": [514713370, 513695478, 520036706] }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const body = await req.json();
  const ids: number[] = body.ids;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return jsonError('Provide { "ids": [514713370, ...] } array', 400, 'MISSING_PARAM');
  }

  if (ids.length > 100) {
    return jsonError('Maximum 100 companies per request', 400, 'TOO_MANY');
  }

  try {
    // Fetch all IDs in parallel
    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const data = await queryCompanies({ id, limit: 1 });
          if (data.result.records.length > 0) {
            return mapRecord(data.result.records[0]);
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    const found = results.filter((r): r is Record<string, unknown> => r !== null);
    const foundIds = new Set(found.map((r) => r.companyNumber));
    const notFound = ids.filter((id) => !foundIds.has(id));

    return NextResponse.json({
      success: true,
      data: {
        found: found.length,
        notFound: notFound.length,
        notFoundIds: notFound,
        results: found,
      },
      source: 'Israeli Corporations Authority (רשם החברות)',
    }, { headers: corsHeaders() });
  } catch {
    return jsonError('Failed to fetch company data', 502, 'UPSTREAM_ERROR');
  }
}

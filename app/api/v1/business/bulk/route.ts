import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, jsonError, corsHeaders } from '@/lib/auth';
import { queryCompanies, mapRecord } from '@/lib/data-gov';

// POST /api/v1/business/bulk
// Body: { "ids": [514713370, 513695478, 520036706] }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');

  const body = await req.json();
  const ids: number[] = body.ids;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return jsonError('Provide { "ids": [514713370, ...] } array', 400, 'MISSING_PARAM');
  }

  if (ids.length > 100) {
    return jsonError('Maximum 100 companies per request', 400, 'TOO_MANY');
  }

  try {
    const data = await queryCompanies({ ids, limit: ids.length });
    const records = data.result.records.map(mapRecord);

    // Mark which IDs were found vs not found
    const foundIds = new Set(records.map((r: Record<string, unknown>) => r.companyNumber));
    const notFound = ids.filter((id) => !foundIds.has(id));

    return NextResponse.json({
      success: true,
      data: {
        found: records.length,
        notFound: notFound.length,
        notFoundIds: notFound,
        results: records,
      },
      source: 'Israeli Corporations Authority (רשם החברות)',
    }, { headers: corsHeaders() });
  } catch {
    return jsonError('Failed to fetch company data', 502, 'UPSTREAM_ERROR');
  }
}

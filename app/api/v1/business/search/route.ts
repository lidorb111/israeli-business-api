import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, jsonError, corsHeaders } from '@/lib/auth';
import { queryCompanies, mapRecord } from '@/lib/data-gov';

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized. Provide a valid API key.', 401, 'UNAUTHORIZED');

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') || undefined;
  const name = searchParams.get('name') || undefined;
  const limit = Math.min(Number(searchParams.get('limit') || 10), 100);
  const offset = Number(searchParams.get('offset') || 0);

  if (!id && !name) {
    return jsonError('Provide either ?id=COMPANY_NUMBER or ?name=SEARCH_TERM', 400, 'MISSING_PARAM');
  }

  try {
    const data = await queryCompanies({ id: id ? Number(id) : undefined, name, limit, offset });
    const records = data.result.records.map(mapRecord);

    return NextResponse.json({
      success: true,
      data: { total: data.result.total, limit, offset, results: records },
      source: 'Israeli Corporations Authority (רשם החברות)',
      lastUpdated: new Date().toISOString().split('T')[0],
    }, { headers: corsHeaders() });
  } catch {
    return jsonError('Failed to fetch company data', 502, 'UPSTREAM_ERROR');
  }
}

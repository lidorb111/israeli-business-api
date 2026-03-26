import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, jsonError, corsHeaders } from '@/lib/auth';
import { queryCompanies, queryAllRegistries, mapRecord } from '@/lib/data-gov';

// GET /api/v1/business/search?name=google
// GET /api/v1/business/search?name=google&registry=all  ← searches ALL registries
// GET /api/v1/business/search?id=513695478
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized. Provide a valid API key.', 401, 'UNAUTHORIZED');

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') || undefined;
  const name = searchParams.get('name') || undefined;
  const registry = searchParams.get('registry') || 'companies';
  const limit = Math.min(Number(searchParams.get('limit') || 10), 100);
  const offset = Number(searchParams.get('offset') || 0);

  if (!id && !name) {
    return jsonError('Provide either ?id=COMPANY_NUMBER or ?name=SEARCH_TERM', 400, 'MISSING_PARAM');
  }

  try {
    if (registry === 'all') {
      const data = await queryAllRegistries({
        name,
        id: id ? Number(id) : undefined,
        limit: Math.min(limit, 25),
      });

      return NextResponse.json({
        success: true,
        data: {
          total: data.total,
          totalByType: data.totalByType,
          results: data.results,
        },
        source: 'Israeli Corporations Authority + Nonprofits + Partnerships + Cooperatives',
        registries: ['companies (722K)', 'nonprofits (74K)', 'partnerships (28K)', 'cooperatives (7K)'],
        lastUpdated: new Date().toISOString().split('T')[0],
      }, { headers: corsHeaders() });
    }

    // Default: companies only
    const data = await queryCompanies({ id: id ? Number(id) : undefined, name, limit, offset });
    const records = data.result.records.map(mapRecord);

    return NextResponse.json({
      success: true,
      data: { total: data.result.total, limit, offset, results: records },
      source: 'Israeli Corporations Authority (רשם החברות)',
      lastUpdated: new Date().toISOString().split('T')[0],
    }, { headers: corsHeaders() });
  } catch {
    return jsonError('Failed to fetch data', 502, 'UPSTREAM_ERROR');
  }
}

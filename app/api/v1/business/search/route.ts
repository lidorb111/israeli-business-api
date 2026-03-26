import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkRateLimit, jsonError, corsHeaders, handleOptions, parseNumericId, sanitizeQuery } from '@/lib/auth';
import { queryCompanies, queryAllRegistries, mapRecord } from '@/lib/data-gov';

const VALID_REGISTRIES = ['companies', 'all'] as const;

export function OPTIONS(req: NextRequest) { return handleOptions(req); }

// GET /api/v1/business/search?name=google
// GET /api/v1/business/search?name=google&registry=all  ← searches ALL registries
// GET /api/v1/business/search?id=513695478
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized. Provide a valid API key.', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded. Max 60 requests/min.', 429, 'RATE_LIMITED');

  const { searchParams } = new URL(req.url);
  const rawId = searchParams.get('id');
  const id = rawId ? parseNumericId(rawId) : undefined;
  const name = sanitizeQuery(searchParams.get('name')) || undefined;
  const registry = searchParams.get('registry') || 'companies';
  const limit = Math.min(Math.max(Number(searchParams.get('limit') || 10) || 10, 1), 100);
  const offset = Math.min(Math.max(Number(searchParams.get('offset') || 0) || 0, 0), 10000);

  if (rawId && !id) {
    return jsonError('Invalid ID — must be a positive number', 400, 'INVALID_PARAM');
  }

  if (!id && !name) {
    return jsonError('Provide either ?id=COMPANY_NUMBER or ?name=SEARCH_TERM', 400, 'MISSING_PARAM');
  }

  if (!VALID_REGISTRIES.includes(registry as typeof VALID_REGISTRIES[number])) {
    return jsonError('registry must be "companies" or "all"', 400, 'INVALID_PARAM');
  }

  try {
    if (registry === 'all') {
      const data = await queryAllRegistries({
        name,
        id: id || undefined,
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
      }, { headers: corsHeaders(req.headers.get('origin')) });
    }

    // Default: companies only
    const data = await queryCompanies({ id: id || undefined, name, limit, offset });
    const records = data.result.records.map(mapRecord);

    return NextResponse.json({
      success: true,
      data: { total: data.result.total, limit, offset, results: records },
      source: 'Israeli Corporations Authority (רשם החברות)',
      lastUpdated: new Date().toISOString().split('T')[0],
    }, { headers: corsHeaders(req.headers.get('origin')) });
  } catch {
    return jsonError('Failed to fetch data', 502, 'UPSTREAM_ERROR');
  }
}

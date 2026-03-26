import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkRateLimit, jsonError, corsHeaders } from '@/lib/auth';
import { queryCompanies, mapRecord } from '@/lib/data-gov';
import { calculateRiskScore } from '@/lib/risk-score';

// GET /api/v1/business/risk?id=514713370
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return jsonError('Provide ?id=COMPANY_NUMBER', 400, 'MISSING_PARAM');

  try {
    const data = await queryCompanies({ id: Number(id), limit: 1 });

    if (!data.result.records.length) {
      return jsonError('Company not found', 404, 'NOT_FOUND');
    }

    const mapped = mapRecord(data.result.records[0]);
    const risk = calculateRiskScore(mapped);

    return NextResponse.json({
      success: true,
      data: {
        company: {
          companyNumber: mapped.companyNumber,
          companyName: mapped.companyName,
          companyNameEn: mapped.companyNameEn,
          status: mapped.status,
        },
        risk,
      },
    }, { headers: corsHeaders() });
  } catch {
    return jsonError('Failed to calculate risk', 502, 'UPSTREAM_ERROR');
  }
}

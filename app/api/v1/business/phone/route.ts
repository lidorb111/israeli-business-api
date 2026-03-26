import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkRateLimit, jsonError, corsHeaders, handleOptions, parseNumericId } from '@/lib/auth';
import { queryCompanies, mapRecord } from '@/lib/data-gov';
import { lookupPhone } from '@/lib/google-places';

export function OPTIONS(req: NextRequest) { return handleOptions(req); }

// GET /api/v1/business/phone?id=513695478
// Premium endpoint — returns phone, website, rating from Google Places
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const id = parseNumericId(new URL(req.url).searchParams.get('id'));
  if (!id) return jsonError('Provide ?id=COMPANY_NUMBER (valid positive number)', 400, 'MISSING_PARAM');

  try {
    const data = await queryCompanies({ id, limit: 1 });
    if (!data.result.records.length) {
      return jsonError('Company not found', 404, 'NOT_FOUND');
    }

    const mapped = mapRecord(data.result.records[0]);
    const companyName = String(mapped.name || '');
    const city = String(mapped.city || '');

    const contact = await lookupPhone(companyName, city);

    if (!contact || !contact.phone) {
      return NextResponse.json({
        success: true,
        data: {
          entityNumber: mapped.entityNumber,
          name: mapped.name,
          contact: null,
          message: 'No phone number found for this company',
        },
      }, { headers: corsHeaders(req.headers.get('origin')) });
    }

    return NextResponse.json({
      success: true,
      data: {
        entityNumber: mapped.entityNumber,
        name: mapped.name,
        nameEn: mapped.nameEn,
        contact,
      },
    }, { headers: corsHeaders(req.headers.get('origin')) });
  } catch {
    return jsonError('Failed to lookup phone', 502, 'UPSTREAM_ERROR');
  }
}

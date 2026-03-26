import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, jsonError, corsHeaders } from '@/lib/auth';
import { queryCompanies, mapRecord } from '@/lib/data-gov';
import { lookupPhone } from '@/lib/google-places';

// GET /api/v1/business/phone?id=513695478
// Premium endpoint — returns phone, website, rating from Google Places
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return jsonError('Provide ?id=COMPANY_NUMBER', 400, 'MISSING_PARAM');

  try {
    const data = await queryCompanies({ id: Number(id), limit: 1 });
    if (!data.result.records.length) {
      return jsonError('Company not found', 404, 'NOT_FOUND');
    }

    const mapped = mapRecord(data.result.records[0]);
    const companyName = String(mapped.companyName || '');
    const city = String(mapped.city || '');

    const contact = await lookupPhone(companyName, city);

    if (!contact || !contact.phone) {
      return NextResponse.json({
        success: true,
        data: {
          companyNumber: mapped.companyNumber,
          companyName: mapped.companyName,
          contact: null,
          message: 'No phone number found for this company',
        },
      }, { headers: corsHeaders() });
    }

    return NextResponse.json({
      success: true,
      data: {
        companyNumber: mapped.companyNumber,
        companyName: mapped.companyName,
        companyNameEn: mapped.companyNameEn,
        contact,
      },
    }, { headers: corsHeaders() });
  } catch {
    return jsonError('Failed to lookup phone', 502, 'UPSTREAM_ERROR');
  }
}

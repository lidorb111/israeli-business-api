import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkRateLimit, jsonError, corsHeaders } from '@/lib/auth';
import { queryCompanies, mapRecord } from '@/lib/data-gov';
import { validateIsraeliId } from '@/lib/israeli-id';
import { calculateRiskScore } from '@/lib/risk-score';
import { lookupPhone } from '@/lib/google-places';

// GET /api/v1/business/enrich?id=513695478
// GET /api/v1/business/enrich?id=513695478&phone=true  ← premium: adds phone, website, rating
// Returns: company data + validation + risk score + estimated size + age
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
    const validation = validateIsraeliId(id);
    const risk = calculateRiskScore(mapped);

    // Calculate age
    const incDate = String(mapped.incorporationDate || '');
    let ageYears: number | null = null;
    if (incDate) {
      const parts = incDate.split('/');
      if (parts.length === 3) {
        ageYears = new Date().getFullYear() - parseInt(parts[2]);
      }
    }

    // Estimate size based on available signals
    let estimatedSize: string = 'unknown';
    const lastReport = Number(mapped.lastAnnualReportYear || 0);
    if (mapped.isGovernment === 'כן') {
      estimatedSize = 'large';
    } else if (ageYears && ageYears > 20 && lastReport >= new Date().getFullYear() - 1) {
      estimatedSize = 'medium-large';
    } else if (ageYears && ageYears > 5) {
      estimatedSize = 'small-medium';
    } else if (ageYears && ageYears <= 2) {
      estimatedSize = 'startup';
    } else {
      estimatedSize = 'small';
    }

    // Build address
    const address = [mapped.street, mapped.houseNumber, mapped.city]
      .filter(Boolean)
      .join(' ');

    // Phone enrichment (premium — uses Google Places API)
    const wantPhone = new URL(req.url).searchParams.get('phone') === 'true';
    let contact = null;
    if (wantPhone) {
      const companyName = String(mapped.name || '');
      const city = String(mapped.city || '');
      contact = await lookupPhone(companyName, city);
    }

    return NextResponse.json({
      success: true,
      data: {
        // Core info
        ...mapped,

        // Enriched fields
        enrichment: {
          validation: {
            valid: validation.valid,
            type: validation.type,
          },
          risk: {
            score: risk.score,
            level: risk.level,
            factors: risk.factors,
          },
          computed: {
            ageYears,
            estimatedSize,
            fullAddress: address || null,
            isActive: String(mapped.status || '').includes('פעילה'),
            isViolator: !!mapped.violator,
            reportingUpToDate: lastReport >= new Date().getFullYear() - 1,
          },
          ...(contact ? { contact } : {}),
        },
      },
    }, { headers: corsHeaders() });
  } catch {
    return jsonError('Failed to enrich company data', 502, 'UPSTREAM_ERROR');
  }
}

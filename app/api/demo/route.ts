import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders, sanitizeQuery } from '@/lib/auth';
import { queryCompanies, queryAllRegistries, mapRecord } from '@/lib/data-gov';
import { validateIsraeliId } from '@/lib/israeli-id';
import { calculateRiskScore } from '@/lib/risk-score';

// Rate limit: 10 requests per minute per IP (stricter than API)
const demoLimits = new Map<string, { count: number; resetAt: number }>();
const DEMO_LIMIT_MAP_MAX = 5_000;
function checkDemoLimit(req: NextRequest): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const entry = demoLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    demoLimits.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  entry.count++;
  if (entry.count > 10) return false;
  return true;
}

// Periodic cleanup
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of demoLimits) {
    if (now > value.resetAt) demoLimits.delete(key);
  }
  if (demoLimits.size > DEMO_LIMIT_MAP_MAX) demoLimits.clear();
}, 60 * 1000);

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
}

// GET /api/demo?q=google — public demo endpoint, no auth needed, strict rate limit
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (!checkDemoLimit(req)) {
    return NextResponse.json(
      { success: false, error: 'Demo rate limit: max 10 requests/min', code: 'RATE_LIMITED' },
      { status: 429, headers }
    );
  }

  const q = sanitizeQuery(new URL(req.url).searchParams.get('q'), 100);
  if (!q || q.length < 2) {
    return NextResponse.json(
      { success: false, error: 'Provide ?q=SEARCH_TERM (min 2 chars)', code: 'MISSING_PARAM' },
      { status: 400, headers }
    );
  }

  try {
    const isNum = /^\d{5,9}$/.test(q);

    if (isNum) {
      // Enrich mode
      const data = await queryCompanies({ id: Number(q), limit: 1 });
      if (!data.result.records.length) {
        return NextResponse.json({ success: false, error: 'Not found', code: 'NOT_FOUND' }, { status: 404 });
      }
      const mapped = mapRecord(data.result.records[0]);
      const validation = validateIsraeliId(q);
      const risk = calculateRiskScore(mapped);

      const incDate = String(mapped.incorporationDate || '');
      let ageYears: number | null = null;
      if (incDate) {
        const parts = incDate.split('/');
        if (parts.length === 3) ageYears = new Date().getFullYear() - parseInt(parts[2]);
      }

      const lastReport = Number(mapped.lastAnnualReportYear || 0);
      let estimatedSize = 'small';
      if (mapped.isGovernment === 'כן') estimatedSize = 'large';
      else if (ageYears && ageYears > 20 && lastReport >= new Date().getFullYear() - 1) estimatedSize = 'medium-large';
      else if (ageYears && ageYears > 5) estimatedSize = 'small-medium';
      else if (ageYears && ageYears <= 2) estimatedSize = 'startup';

      const address = [mapped.street, mapped.houseNumber, mapped.city].filter(Boolean).join(' ');

      return NextResponse.json({
        success: true,
        data: {
          ...mapped,
          enrichment: {
            validation: { valid: validation.valid, type: validation.type },
            risk: { score: risk.score, level: risk.level, factors: risk.factors },
            computed: {
              ageYears, estimatedSize,
              fullAddress: address || null,
              isActive: String(mapped.status || '').includes('פעילה'),
              isViolator: !!mapped.violator,
              reportingUpToDate: lastReport >= new Date().getFullYear() - 1,
            },
          },
        },
      }, { headers });
    } else {
      // Search mode
      const data = await queryAllRegistries({ name: q, limit: 15 });
      return NextResponse.json({
        success: true,
        data: {
          total: data.total,
          totalByType: data.totalByType,
          results: data.results,
        },
      }, { headers });
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Search failed', code: 'ERROR' },
      { status: 500, headers }
    );
  }
}

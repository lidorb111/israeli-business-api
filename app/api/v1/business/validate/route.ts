import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkRateLimit, jsonError, corsHeaders, handleOptions, safeJsonParse, sanitizeQuery } from '@/lib/auth';
import { validateIsraeliId, validateBatch } from '@/lib/israeli-id';

export function OPTIONS(req: NextRequest) { return handleOptions(req); }

// GET /api/v1/business/validate?id=514713370
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const id = sanitizeQuery(new URL(req.url).searchParams.get('id'), 20);
  if (!id) return jsonError('Provide ?id=NUMBER', 400, 'MISSING_PARAM');

  const result = validateIsraeliId(id);

  return NextResponse.json({ success: true, data: result }, { headers: corsHeaders(req.headers.get('origin')) });
}

// POST /api/v1/business/validate — batch validation
// Body: { "ids": ["514713370", "513695478", "123456789"] }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');
  if (!checkRateLimit(req)) return jsonError('Rate limit exceeded', 429, 'RATE_LIMITED');

  const [body, parseError] = await safeJsonParse(req);
  if (parseError) return parseError;

  const ids = body!.ids;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return jsonError('Provide { "ids": ["..."] } array', 400, 'MISSING_PARAM');
  }

  // Validate each entry is a string
  if (!ids.every((id: unknown) => typeof id === 'string')) {
    return jsonError('Each ID must be a string', 400, 'INVALID_PARAM');
  }

  if (ids.length > 500) {
    return jsonError('Maximum 500 IDs per request', 400, 'TOO_MANY');
  }

  const results = validateBatch(ids as string[]);

  return NextResponse.json({
    success: true,
    data: {
      total: results.length,
      valid: results.filter((r) => r.valid).length,
      invalid: results.filter((r) => !r.valid).length,
      results,
    },
  }, { headers: corsHeaders(req.headers.get('origin')) });
}

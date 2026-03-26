import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, jsonError, corsHeaders } from '@/lib/auth';
import { validateIsraeliId, validateBatch } from '@/lib/israeli-id';

// GET /api/v1/business/validate?id=514713370
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return jsonError('Provide ?id=NUMBER', 400, 'MISSING_PARAM');

  const result = validateIsraeliId(id);

  return NextResponse.json({ success: true, data: result }, { headers: corsHeaders() });
}

// POST /api/v1/business/validate — batch validation
// Body: { "ids": ["514713370", "513695478", "123456789"] }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return jsonError('Unauthorized', 401, 'UNAUTHORIZED');

  const body = await req.json();
  const ids: string[] = body.ids;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return jsonError('Provide { "ids": ["..."] } array', 400, 'MISSING_PARAM');
  }

  if (ids.length > 500) {
    return jsonError('Maximum 500 IDs per request', 400, 'TOO_MANY');
  }

  const results = validateBatch(ids);

  return NextResponse.json({
    success: true,
    data: {
      total: results.length,
      valid: results.filter((r) => r.valid).length,
      invalid: results.filter((r) => !r.valid).length,
      results,
    },
  }, { headers: corsHeaders() });
}

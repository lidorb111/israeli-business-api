import { NextRequest, NextResponse } from 'next/server';

const RESOURCE_ID = 'f004176c-b85f-4542-8901-7b3176f9a054';
const DATA_GOV_API = 'https://data.gov.il/api/3/action/datastore_search';

// Field name mapping (Hebrew → English)
const FIELD_MAP: Record<string, string> = {
  'מספר חברה': 'companyNumber',
  'שם חברה': 'companyName',
  'שם באנגלית': 'companyNameEn',
  'סוג תאגיד': 'companyType',
  'סטטוס חברה': 'status',
  'תאור חברה': 'description',
  'מטרת החברה': 'purpose',
  'תאריך התאגדות': 'incorporationDate',
  'חברה ממשלתית': 'isGovernment',
  'מגבלות': 'limitations',
  'מפרה': 'violator',
  'שנה אחרונה של דוח שנתי (שהוגש)': 'lastAnnualReportYear',
  'שם עיר': 'city',
  'שם רחוב': 'street',
  'מספר בית': 'houseNumber',
  'מיקוד': 'zipCode',
  'ת.ד.': 'poBox',
  'מדינה': 'country',
  'אצל': 'careOf',
  'תת סטטוס': 'subStatus',
};

function mapRecord(record: Record<string, unknown>) {
  const mapped: Record<string, unknown> = {};
  for (const [heKey, enKey] of Object.entries(FIELD_MAP)) {
    if (record[heKey] !== undefined && record[heKey] !== null && record[heKey] !== '') {
      mapped[enKey] = record[heKey];
    }
  }
  return mapped;
}

async function searchCompanies(params: {
  id?: string;
  name?: string;
  limit?: number;
  offset?: number;
}) {
  const { id, name, limit = 10, offset = 0 } = params;

  let url = `${DATA_GOV_API}?resource_id=${RESOURCE_ID}&limit=${limit}&offset=${offset}`;

  if (id) {
    // Search by company number
    url += `&filters=${encodeURIComponent(JSON.stringify({ 'מספר חברה': Number(id) }))}`;
  } else if (name) {
    // Full-text search by name
    url += `&q=${encodeURIComponent(name)}`;
  }

  const response = await fetch(url, {
    headers: { 'User-Agent': 'IsraeliBusinessAPI/1.0' },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`data.gov.il returned ${response.status}`);
  }

  return response.json();
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret',
  };
}

// GET /api/v1/business/search?id=514713370
// GET /api/v1/business/search?name=טלעד
// GET /api/v1/business/search?name=google&limit=5
export async function GET(req: NextRequest) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders() });
  }

  // Auth check (RapidAPI proxy secret or direct API key)
  const proxySecret = req.headers.get('x-rapidapi-proxy-secret');
  const apiKey = req.headers.get('x-api-key');
  const rapidApiProxySecret = process.env.RAPIDAPI_PROXY_SECRET;
  const apiSecretKey = process.env.API_SECRET_KEY;
  const isDev = process.env.NODE_ENV !== 'production';

  const isAuthed =
    isDev ||
    (proxySecret && rapidApiProxySecret && proxySecret === rapidApiProxySecret) ||
    (apiKey && apiSecretKey && apiKey === apiSecretKey);

  if (!isAuthed) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Provide a valid API key.', code: 'UNAUTHORIZED' },
      { status: 401, headers: corsHeaders() }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') || undefined;
  const name = searchParams.get('name') || undefined;
  const limit = Math.min(Number(searchParams.get('limit') || 10), 100);
  const offset = Number(searchParams.get('offset') || 0);

  if (!id && !name) {
    return NextResponse.json(
      { success: false, error: 'Provide either ?id=COMPANY_NUMBER or ?name=SEARCH_TERM', code: 'MISSING_PARAM' },
      { status: 400, headers: corsHeaders() }
    );
  }

  try {
    const data = await searchCompanies({ id, name, limit, offset });

    if (!data.success) {
      throw new Error('data.gov.il API error');
    }

    const records = data.result.records.map(mapRecord);
    const total = data.result.total;

    return NextResponse.json(
      {
        success: true,
        data: {
          total,
          limit,
          offset,
          results: records,
        },
        source: 'Israeli Corporations Authority (רשם החברות)',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error('[Business API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company data', code: 'UPSTREAM_ERROR' },
      { status: 502, headers: corsHeaders() }
    );
  }
}

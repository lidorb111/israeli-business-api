const COMPANIES_RESOURCE = 'f004176c-b85f-4542-8901-7b3176f9a054';
const DATA_GOV_API = 'https://data.gov.il/api/3/action/datastore_search';

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

export function mapRecord(record: Record<string, unknown>) {
  const mapped: Record<string, unknown> = {};
  for (const [heKey, enKey] of Object.entries(FIELD_MAP)) {
    if (record[heKey] !== undefined && record[heKey] !== null && record[heKey] !== '') {
      mapped[enKey] = record[heKey];
    }
  }
  return mapped;
}

export async function queryCompanies(params: {
  id?: number;
  ids?: number[];
  name?: string;
  limit?: number;
  offset?: number;
}) {
  const { id, ids, name, limit = 10, offset = 0 } = params;

  let url = `${DATA_GOV_API}?resource_id=${COMPANIES_RESOURCE}&limit=${limit}&offset=${offset}`;

  if (id) {
    url += `&filters=${encodeURIComponent(JSON.stringify({ 'מספר חברה': id }))}`;
  } else if (ids && ids.length > 0) {
    // CKAN doesn't support IN queries, so we use SQL
    const idList = ids.join(',');
    const sqlUrl = `https://data.gov.il/api/3/action/datastore_search_sql?sql=${encodeURIComponent(
      `SELECT * FROM "${COMPANIES_RESOURCE}" WHERE "מספר חברה" IN (${idList}) LIMIT ${limit}`
    )}`;
    const response = await fetch(sqlUrl, {
      headers: { 'User-Agent': 'IsraeliBusinessAPI/1.0' },
    });
    if (!response.ok) throw new Error(`data.gov.il returned ${response.status}`);
    return response.json();
  } else if (name) {
    url += `&q=${encodeURIComponent(name)}`;
  }

  const response = await fetch(url, {
    headers: { 'User-Agent': 'IsraeliBusinessAPI/1.0' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`data.gov.il returned ${response.status}`);
  }

  return response.json();
}

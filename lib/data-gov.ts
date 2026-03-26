const DATA_GOV_API = 'https://data.gov.il/api/3/action/datastore_search';

// All 4 registries
const RESOURCES = {
  companies: {
    id: 'f004176c-b85f-4542-8901-7b3176f9a054',
    type: 'company' as const,
    fieldMap: {
      'מספר חברה': 'entityNumber',
      'שם חברה': 'name',
      'שם באנגלית': 'nameEn',
      'סוג תאגיד': 'entityType',
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
    },
  },
  nonprofits: {
    id: 'be5b7935-3922-45d4-9638-08871b17ec95',
    type: 'nonprofit' as const,
    fieldMap: {
      'מספר עמותה': 'entityNumber',
      'שם עמותה בעברית': 'name',
      'שם עמותה באנגלית': 'nameEn',
      'סטטוס עמותה': 'status',
      'תאריך רישום עמותה': 'incorporationDate',
      'סיווג פעילות ענפי': 'activityType',
      'תחום פעילות משני': 'secondaryActivity',
      'מחזור כספי (הכנסות)': 'revenue',
      'סך הוצאות העמותה': 'expenses',
      'כמות עובדים': 'employeeCount',
      'כמות מתנדבים': 'volunteerCount',
      'מספר חברי עמותה': 'memberCount',
      'שנת דיווח אחרונה': 'lastReportYear',
      'כתובת - ישוב': 'city',
      'כתובת - רחוב': 'street',
      'כתובת - מספר דירה': 'houseNumber',
      'כתובת - מיקוד': 'zipCode',
      'מטרות עמותה': 'purpose',
      'איזורי פעילות': 'activityRegions',
    },
  },
  partnerships: {
    id: '139aa193-fabb-4f6b-a71b-0bb40fd73eb2',
    type: 'partnership' as const,
    fieldMap: {
      'מספר שותפות': 'entityNumber',
      'שם שותפות': 'name',
      'שם באנגלית': 'nameEn',
      'סוג תאגיד': 'entityType',
      'סטטוס תאגיד': 'status',
      'תאריך התאגדות': 'incorporationDate',
      'ישוב': 'city',
      'רחוב': 'street',
      'מספר בית': 'houseNumber',
      'מיקוד': 'zipCode',
      'ת.ד': 'poBox',
      'מדינה': 'country',
      'אצל': 'careOf',
    },
  },
  cooperatives: {
    id: 'cad6bb66-5560-4cf4-a39c-92518f3f18ef',
    type: 'cooperative' as const,
    fieldMap: {
      'Identity': 'entityNumber',
      'Name': 'name',
      'StatusDesc': 'status',
      'RegistrationDate': 'incorporationDate',
      'TownName': 'city',
      'StreetName': 'street',
      'Building': 'houseNumber',
      'zip': 'zipCode',
      'phone': 'phone',
      'PrimaryType': 'activityType',
      'SecondaryTypes': 'secondaryActivity',
    },
  },
};

type RegistryType = keyof typeof RESOURCES;

function mapRecordWithType(record: Record<string, unknown>, registry: RegistryType) {
  const { fieldMap, type } = RESOURCES[registry];
  const mapped: Record<string, unknown> = { registryType: type };
  for (const [sourceKey, targetKey] of Object.entries(fieldMap)) {
    if (record[sourceKey] !== undefined && record[sourceKey] !== null && record[sourceKey] !== '') {
      mapped[targetKey] = record[sourceKey];
    }
  }
  return mapped;
}

// Legacy support
export function mapRecord(record: Record<string, unknown>) {
  return mapRecordWithType(record, 'companies');
}

async function fetchFromRegistry(
  registry: RegistryType,
  params: { id?: number; name?: string; limit?: number; offset?: number }
) {
  const { id, name, limit = 10, offset = 0 } = params;
  const resource = RESOURCES[registry];
  const numberField = Object.entries(resource.fieldMap).find(([, v]) => v === 'entityNumber')?.[0];

  let url = `${DATA_GOV_API}?resource_id=${resource.id}&limit=${limit}&offset=${offset}`;

  if (id && numberField) {
    url += `&filters=${encodeURIComponent(JSON.stringify({ [numberField]: id }))}`;
  } else if (name) {
    url += `&q=${encodeURIComponent(name)}`;
  }

  const response = await fetch(url, {
    headers: { 'User-Agent': 'IsraeliBusinessAPI/1.0' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error(`data.gov.il returned ${response.status}`);
  const data = await response.json();

  return {
    total: data.result.total as number,
    records: data.result.records.map((r: Record<string, unknown>) => mapRecordWithType(r, registry)),
  };
}

// Query single registry (companies by default)
export async function queryCompanies(params: {
  id?: number;
  name?: string;
  limit?: number;
  offset?: number;
}) {
  const { id, name, limit = 10, offset = 0 } = params;
  const resource = RESOURCES.companies;

  let url = `${DATA_GOV_API}?resource_id=${resource.id}&limit=${limit}&offset=${offset}`;

  if (id) {
    url += `&filters=${encodeURIComponent(JSON.stringify({ 'מספר חברה': id }))}`;
  } else if (name) {
    url += `&q=${encodeURIComponent(name)}`;
  }

  const response = await fetch(url, {
    headers: { 'User-Agent': 'IsraeliBusinessAPI/1.0' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error(`data.gov.il returned ${response.status}`);
  return response.json();
}

// Query ALL registries in parallel
export async function queryAllRegistries(params: {
  name?: string;
  id?: number;
  limit?: number;
  registries?: RegistryType[];
}) {
  const { name, id, limit = 5, registries = ['companies', 'nonprofits', 'partnerships', 'cooperatives'] } = params;

  const results = await Promise.all(
    registries.map(async (registry) => {
      try {
        return await fetchFromRegistry(registry, { name, id, limit });
      } catch {
        return { total: 0, records: [] };
      }
    })
  );

  const allRecords = results.flatMap((r) => r.records);
  const totalByType: Record<string, number> = {};
  registries.forEach((reg, i) => {
    totalByType[RESOURCES[reg].type] = results[i].total;
  });

  return {
    total: results.reduce((sum, r) => sum + r.total, 0),
    totalByType,
    results: allRecords,
  };
}

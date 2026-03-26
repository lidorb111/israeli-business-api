export default function Home() {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, background: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
          <h1 style={{ color: '#38bdf8', textAlign: 'center' }}>Israeli Business Lookup API</h1>
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>832,968 entities — Companies + Nonprofits + Partnerships + Cooperatives</p>

          <div id="app"></div>

          <script dangerouslySetInnerHTML={{ __html: `
const API = '/api/v1/business';
const KEY = 'test-key-12345';
const H = { 'Content-Type': 'application/json', 'X-API-Key': KEY };

function fmt(n) { return n ? new Intl.NumberFormat('he-IL').format(n) : '-'; }

function el(tag, attrs, ...children) {
  const e = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k,v]) => {
    if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}

const card = (title, ...children) => el('div', { style: { background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #334155' } },
  el('h2', { style: { color: '#38bdf8', fontSize: '18px', marginBottom: '12px' } }, title),
  ...children
);

const input = (id, placeholder, val) => el('input', { id, placeholder, value: val || '', style: { background: '#0f172a', border: '1px solid #475569', color: '#f1f5f9', padding: '10px', borderRadius: '8px', width: '100%', marginBottom: '8px', fontSize: '15px', boxSizing: 'border-box' } });

const btn = (text, onClick) => el('button', { onClick, style: { background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', width: '100%', marginTop: '4px' } }, text);

const result = (id) => el('pre', { id, style: { background: '#0f172a', padding: '12px', borderRadius: '8px', marginTop: '12px', fontSize: '13px', overflow: 'auto', maxHeight: '400px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'none' } });

async function call(url, opts, resultId) {
  const r = document.getElementById(resultId);
  r.style.display = 'block';
  r.textContent = 'Loading...';
  try {
    const res = await fetch(url, opts);
    const d = await res.json();
    r.textContent = JSON.stringify(d, null, 2);
  } catch(e) {
    r.textContent = 'Error: ' + e.message;
  }
}

const app = document.getElementById('app');

// 1. Search
app.appendChild(card('Search — companies, nonprofits, partnerships, cooperatives',
  input('s-name', 'Company name (e.g. google, מרכז)'),
  el('label', { style: { color: '#94a3b8', fontSize: '13px' } },
    el('input', { type: 'checkbox', id: 's-all', style: { marginLeft: '8px' } }), ' Search all registries (832K entities)'
  ),
  btn('Search', () => {
    const name = document.getElementById('s-name').value;
    const all = document.getElementById('s-all').checked;
    call(API + '/search?name=' + encodeURIComponent(name) + '&limit=10' + (all ? '&registry=all' : ''), { headers: H }, 'r-search');
  }),
  result('r-search')
));

// 2. Validate
app.appendChild(card('Validate — ID / Company Number',
  input('v-id', 'Enter ID or company number (e.g. 513695478)'),
  btn('Validate', () => {
    call(API + '/validate?id=' + document.getElementById('v-id').value, { headers: H }, 'r-validate');
  }),
  result('r-validate')
));

// 3. Risk Score
app.appendChild(card('Risk Score — Company Risk Assessment',
  input('risk-id', 'Company number (e.g. 510000011)'),
  btn('Calculate Risk', () => {
    call(API + '/risk?id=' + document.getElementById('risk-id').value, { headers: H }, 'r-risk');
  }),
  result('r-risk')
));

// 4. Enrich
app.appendChild(card('Enrich — Full Company Intelligence',
  input('e-id', 'Company number (e.g. 513695478)'),
  btn('Enrich', () => {
    call(API + '/enrich?id=' + document.getElementById('e-id').value, { headers: H }, 'r-enrich');
  }),
  result('r-enrich')
));

// 5. Autocomplete
app.appendChild(card('Autocomplete — Type-ahead Search',
  input('ac-q', 'Start typing... (e.g. גוג, apple)'),
  btn('Get Suggestions', () => {
    call(API + '/autocomplete?q=' + encodeURIComponent(document.getElementById('ac-q').value), { headers: H }, 'r-ac');
  }),
  result('r-ac')
));

// 6. Bulk
app.appendChild(card('Bulk Lookup — Multiple Companies',
  input('b-ids', 'Comma-separated IDs (e.g. 513695478,510000011)'),
  btn('Lookup All', () => {
    const ids = document.getElementById('b-ids').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    call(API + '/bulk', { method: 'POST', headers: H, body: JSON.stringify({ ids }) }, 'r-bulk');
  }),
  result('r-bulk')
));

// 7. Batch Validate
app.appendChild(card('Batch Validate — Check Multiple IDs',
  input('bv-ids', 'Comma-separated IDs (e.g. 513695478,123456789,510000011)'),
  btn('Validate All', () => {
    const ids = document.getElementById('bv-ids').value.split(',').map(s => s.trim()).filter(Boolean);
    call(API + '/validate', { method: 'POST', headers: H, body: JSON.stringify({ ids }) }, 'r-bv');
  }),
  result('r-bv')
));
          `}} />
        </div>
      </body>
    </html>
  );
}

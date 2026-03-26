export default function Home() {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Israeli Business API — Search 832K+ Companies</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0 }}>
        <div id="root"></div>
        <script dangerouslySetInnerHTML={{ __html: `
const API = '/api/v1/business';
const KEY = 'test-key-12345';
const H = { 'Content-Type': 'application/json', 'X-API-Key': KEY };

document.getElementById('root').innerHTML = \`
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', -apple-system, sans-serif; background: #fafbfc; color: #1a1a2e; }

  .hero {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a4a7a 100%);
    padding: 60px 20px 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 50%, rgba(56,189,248,0.08) 0%, transparent 50%),
                radial-gradient(circle at 70% 50%, rgba(99,102,241,0.06) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-20px, 10px); }
  }

  .hero-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
  .hero h1 { color: white; font-size: 42px; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px; }
  .hero p { color: #94a3b8; font-size: 18px; margin-bottom: 36px; line-height: 1.6; }
  .hero .highlight { color: #38bdf8; }

  .search-box {
    background: white;
    border-radius: 20px;
    padding: 8px;
    display: flex;
    gap: 0;
    box-shadow: 0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
    max-width: 600px;
    margin: 0 auto;
    position: relative;
  }
  .search-box input {
    flex: 1;
    border: none;
    outline: none;
    padding: 18px 24px;
    font-size: 18px;
    font-family: inherit;
    border-radius: 16px;
    color: #1a1a2e;
    background: transparent;
    min-width: 0;
  }
  .search-box input::placeholder { color: #94a3b8; }
  .search-box button {
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: white;
    border: none;
    padding: 18px 32px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 14px;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: all 0.2s;
  }
  .search-box button:hover { transform: scale(1.02); box-shadow: 0 4px 15px rgba(37,99,235,0.4); }
  .search-box button:active { transform: scale(0.98); }

  .stats-bar {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 32px;
    flex-wrap: wrap;
  }
  .stat { text-align: center; }
  .stat-num { color: white; font-size: 24px; font-weight: 700; }
  .stat-label { color: #64748b; font-size: 13px; margin-top: 4px; }

  .results-area {
    max-width: 800px;
    margin: -40px auto 0;
    padding: 0 20px 60px;
    position: relative;
    z-index: 2;
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: #64748b;
    display: none;
  }
  .loading.show { display: block; }
  .loading .spinner {
    width: 36px; height: 36px;
    border: 3px solid #e2e8f0;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 12px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .result-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    border: 1px solid #f0f0f5;
    transition: all 0.2s;
    cursor: pointer;
  }
  .result-card:hover { box-shadow: 0 8px 25px rgba(0,0,0,0.08); transform: translateY(-2px); }

  .result-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
  .result-name { font-size: 18px; font-weight: 700; color: #1a1a2e; }
  .result-name-en { font-size: 14px; color: #64748b; margin-top: 2px; }
  .result-id { font-size: 13px; color: #94a3b8; font-family: 'SF Mono', monospace; }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge-green { background: #ecfdf5; color: #059669; }
  .badge-red { background: #fef2f2; color: #dc2626; }
  .badge-orange { background: #fff7ed; color: #ea580c; }
  .badge-blue { background: #eff6ff; color: #2563eb; }
  .badge-purple { background: #f5f3ff; color: #7c3aed; }
  .badge-gray { background: #f8fafc; color: #64748b; }

  .result-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f5;
  }
  .meta-item { font-size: 13px; color: #64748b; display: flex; align-items: center; gap: 4px; }
  .meta-icon { font-size: 15px; }

  .detail-panel {
    display: none;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f5;
  }
  .detail-panel.show { display: block; }
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .detail-item { }
  .detail-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
  .detail-value { font-size: 14px; color: #1a1a2e; font-weight: 500; margin-top: 2px; }

  .risk-bar {
    height: 8px;
    background: #f0f0f5;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 8px;
  }
  .risk-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.6s ease;
  }

  .summary-bar {
    background: white;
    border-radius: 16px;
    padding: 16px 24px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f5;
    display: none;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .summary-bar.show { display: flex; }
  .summary-text { font-size: 15px; color: #64748b; }
  .summary-text strong { color: #1a1a2e; }
  .summary-types { display: flex; gap: 8px; flex-wrap: wrap; }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    display: none;
  }
  .empty-state.show { display: block; }
  .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state p { color: #94a3b8; font-size: 16px; }

  .footer {
    text-align: center;
    padding: 40px 20px;
    color: #94a3b8;
    font-size: 13px;
  }
  .footer a { color: #2563eb; text-decoration: none; }

  @media (max-width: 640px) {
    .hero h1 { font-size: 28px; }
    .hero p { font-size: 15px; }
    .search-box { flex-direction: column; }
    .search-box button { width: 100%; }
    .stats-bar { gap: 24px; }
    .detail-grid { grid-template-columns: 1fr; }
    .result-header { flex-direction: column; }
  }
</style>

<div class="hero">
  <div class="hero-content">
    <h1>Search Any Israeli Business</h1>
    <p>Search <span class="highlight">832,968</span> companies, nonprofits, partnerships & cooperatives from the official Israeli government registry</p>

    <div class="search-box">
      <input id="search-input" type="text" placeholder="Search by name or number..." autofocus />
      <button id="search-btn" onclick="doSearch()">Search</button>
    </div>

    <div class="stats-bar">
      <div class="stat"><div class="stat-num">722K</div><div class="stat-label">Companies</div></div>
      <div class="stat"><div class="stat-num">74K</div><div class="stat-label">Nonprofits</div></div>
      <div class="stat"><div class="stat-num">28K</div><div class="stat-label">Partnerships</div></div>
      <div class="stat"><div class="stat-num">7K</div><div class="stat-label">Cooperatives</div></div>
    </div>
  </div>
</div>

<div class="results-area">
  <div class="loading" id="loading">
    <div class="spinner"></div>
    Searching all registries...
  </div>

  <div class="summary-bar" id="summary"></div>

  <div id="results"></div>

  <div class="empty-state" id="empty">
    <div class="icon">&#x1F50D;</div>
    <p>No results found. Try a different search term.</p>
  </div>
</div>

<div class="footer">
  Powered by <a href="https://data.gov.il" target="_blank">data.gov.il</a> — Israeli Corporations Authority<br/>
  <a href="https://rapidapi.com" target="_blank">Get API Access</a>
</div>
\`;

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

const typeColors = {
  company: 'blue',
  nonprofit: 'purple',
  partnership: 'orange',
  cooperative: 'green',
};
const typeLabels = {
  company: 'Company',
  nonprofit: 'Nonprofit',
  partnership: 'Partnership',
  cooperative: 'Cooperative',
};
const statusColors = {
  default: 'gray',
};

function getStatusBadge(status) {
  if (!status) return '';
  const s = status.toLowerCase ? status.toLowerCase() : '';
  let color = 'gray';
  if (status.includes('פעילה') || status.includes('רשומה')) color = 'green';
  else if (status.includes('מחוקה') || status.includes('מחוסלת')) color = 'red';
  else if (status.includes('פירוק')) color = 'orange';
  return '<span class="badge badge-' + color + '">' + status + '</span>';
}

async function doSearch() {
  const q = searchInput.value.trim();
  if (!q) return;

  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const summary = document.getElementById('summary');
  const empty = document.getElementById('empty');

  loading.classList.add('show');
  results.innerHTML = '';
  summary.classList.remove('show');
  empty.classList.remove('show');

  const isNumber = /^\\d{5,9}$/.test(q);
  let url;

  if (isNumber) {
    url = API + '/enrich?id=' + q;
  } else {
    url = API + '/search?name=' + encodeURIComponent(q) + '&registry=all&limit=20';
  }

  try {
    const res = await fetch(url, { headers: H });
    const d = await res.json();
    loading.classList.remove('show');

    if (!d.success) {
      empty.classList.add('show');
      return;
    }

    if (isNumber) {
      // Single enriched result
      const r = d.data;
      summary.innerHTML = '<span class="summary-text">Showing enriched data for <strong>' + q + '</strong></span>';
      summary.classList.add('show');
      results.innerHTML = renderEnrichedCard(r);
    } else {
      const items = d.data.results || [];
      if (items.length === 0) {
        empty.classList.add('show');
        return;
      }

      const types = d.data.totalByType || {};
      let typeBadges = '';
      Object.entries(types).forEach(([type, count]) => {
        if (count > 0) {
          typeBadges += '<span class="badge badge-' + (typeColors[type] || 'gray') + '">' + (typeLabels[type] || type) + ': ' + Number(count).toLocaleString() + '</span>';
        }
      });

      summary.innerHTML = '<span class="summary-text"><strong>' + Number(d.data.total).toLocaleString() + '</strong> results found</span><div class="summary-types">' + typeBadges + '</div>';
      summary.classList.add('show');

      items.forEach((r, i) => {
        results.innerHTML += renderCard(r, i);
      });
    }
  } catch(e) {
    loading.classList.remove('show');
    empty.querySelector('p').textContent = 'Error: ' + e.message;
    empty.classList.add('show');
  }
}

function renderCard(r, i) {
  const type = r.registryType || 'company';
  const typeBadge = '<span class="badge badge-' + (typeColors[type] || 'gray') + '">' + (typeLabels[type] || type) + '</span>';
  const statusBadge = getStatusBadge(r.status);
  const name = r.name || r.companyName || '-';
  const nameEn = r.nameEn || r.companyNameEn || '';
  const id = r.entityNumber || r.companyNumber || '';
  const city = r.city || '';
  const date = r.incorporationDate || '';

  return '<div class="result-card" onclick="toggleDetail(' + i + ')">' +
    '<div class="result-header">' +
      '<div>' +
        '<div class="result-name">' + name + '</div>' +
        (nameEn ? '<div class="result-name-en">' + nameEn + '</div>' : '') +
      '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' + typeBadge + ' ' + statusBadge + '</div>' +
    '</div>' +
    '<div class="result-meta">' +
      '<div class="meta-item"><span class="meta-icon">#</span> ' + id + '</div>' +
      (city ? '<div class="meta-item"><span class="meta-icon">&#x1F4CD;</span> ' + city + '</div>' : '') +
      (date ? '<div class="meta-item"><span class="meta-icon">&#x1F4C5;</span> ' + date + '</div>' : '') +
    '</div>' +
    '<div class="detail-panel" id="detail-' + i + '">' +
      '<div style="text-align:center;color:#94a3b8;padding:12px">Loading details...</div>' +
    '</div>' +
  '</div>';
}

function renderEnrichedCard(r) {
  const e = r.enrichment || {};
  const risk = e.risk || {};
  const comp = e.computed || {};
  const val = e.validation || {};

  const riskColor = risk.score >= 75 ? '#059669' : risk.score >= 50 ? '#ea580c' : '#dc2626';
  const name = r.companyName || r.name || '-';
  const nameEn = r.companyNameEn || r.nameEn || '';

  let factorsHtml = '';
  (risk.factors || []).forEach(f => {
    const icon = f.impact > 0 ? '&#x2705;' : f.impact === 0 ? '&#x2705;' : '&#x26A0;&#xFE0F;';
    factorsHtml += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5"><span>' + icon + ' ' + f.detail + '</span><span style="font-weight:600;color:' + (f.impact >= 0 ? '#059669' : '#dc2626') + '">' + (f.impact >= 0 ? '+' : '') + f.impact + '</span></div>';
  });

  return '<div class="result-card" style="cursor:default">' +
    '<div class="result-header">' +
      '<div>' +
        '<div class="result-name" style="font-size:22px">' + name + '</div>' +
        (nameEn ? '<div class="result-name-en" style="font-size:16px">' + nameEn + '</div>' : '') +
      '</div>' +
      getStatusBadge(r.status) +
    '</div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin:20px 0;padding:20px;background:#f8fafc;border-radius:12px">' +
      '<div style="text-align:center"><div style="font-size:32px;font-weight:800;color:' + riskColor + '">' + (risk.score || '-') + '</div><div style="font-size:12px;color:#94a3b8;margin-top:4px">Risk Score</div></div>' +
      '<div style="text-align:center"><div style="font-size:32px;font-weight:800;color:#1a1a2e">' + (comp.ageYears || '-') + '</div><div style="font-size:12px;color:#94a3b8;margin-top:4px">Years Active</div></div>' +
      '<div style="text-align:center"><div style="font-size:32px;font-weight:800;color:#2563eb">' + (comp.estimatedSize || '-') + '</div><div style="font-size:12px;color:#94a3b8;margin-top:4px">Est. Size</div></div>' +
    '</div>' +

    '<div class="risk-bar"><div class="risk-fill" style="width:' + (risk.score || 0) + '%;background:' + riskColor + '"></div></div>' +

    '<div class="detail-grid" style="margin-top:20px">' +
      '<div class="detail-item"><div class="detail-label">Entity Number</div><div class="detail-value">' + (r.entityNumber || r.companyNumber || '-') + '</div></div>' +
      '<div class="detail-item"><div class="detail-label">Type</div><div class="detail-value">' + (r.companyType || r.entityType || '-') + '</div></div>' +
      '<div class="detail-item"><div class="detail-label">Founded</div><div class="detail-value">' + (r.incorporationDate || '-') + '</div></div>' +
      '<div class="detail-item"><div class="detail-label">Address</div><div class="detail-value">' + (comp.fullAddress || '-') + '</div></div>' +
      '<div class="detail-item"><div class="detail-label">ID Valid</div><div class="detail-value">' + (val.valid ? '&#x2705; Valid ' + val.type : '&#x274C; Invalid') + '</div></div>' +
      '<div class="detail-item"><div class="detail-label">Reporting</div><div class="detail-value">' + (comp.reportingUpToDate ? '&#x2705; Up to date' : '&#x26A0;&#xFE0F; Outdated') + '</div></div>' +
      '<div class="detail-item"><div class="detail-label">Violator</div><div class="detail-value">' + (comp.isViolator ? '&#x26A0;&#xFE0F; Yes' : '&#x2705; No') + '</div></div>' +
      '<div class="detail-item"><div class="detail-label">Purpose</div><div class="detail-value">' + (r.purpose || '-') + '</div></div>' +
    '</div>' +

    (factorsHtml ? '<div style="margin-top:20px"><div style="font-size:13px;font-weight:600;color:#64748b;margin-bottom:8px">RISK FACTORS</div>' + factorsHtml + '</div>' : '') +
  '</div>';
}

async function toggleDetail(i) {
  const panel = document.getElementById('detail-' + i);
  if (panel.classList.contains('show')) {
    panel.classList.remove('show');
    return;
  }
  panel.classList.add('show');

  const card = panel.parentElement;
  const idEl = card.querySelector('.meta-item');
  const id = idEl ? idEl.textContent.replace('#', '').trim() : '';
  if (!id || isNaN(parseInt(id))) return;

  try {
    const res = await fetch(API + '/enrich?id=' + id, { headers: H });
    const d = await res.json();
    if (!d.success) { panel.innerHTML = '<div style="color:#dc2626">Not found</div>'; return; }
    const e = d.data.enrichment || {};
    const risk = e.risk || {};
    const comp = e.computed || {};
    const riskColor = risk.score >= 75 ? '#059669' : risk.score >= 50 ? '#ea580c' : '#dc2626';

    panel.innerHTML =
      '<div style="display:flex;gap:24px;margin-bottom:12px">' +
        '<div><span style="font-size:28px;font-weight:800;color:' + riskColor + '">' + risk.score + '</span><span style="font-size:13px;color:#94a3b8"> /100 risk</span></div>' +
        '<div><span style="font-size:28px;font-weight:800">' + (comp.ageYears || '?') + '</span><span style="font-size:13px;color:#94a3b8"> years</span></div>' +
        '<div><span class="badge badge-' + (comp.isViolator ? 'red' : 'green') + '">' + (comp.isViolator ? 'Violator' : 'Clean') + '</span></div>' +
      '</div>' +
      '<div class="risk-bar"><div class="risk-fill" style="width:' + risk.score + '%;background:' + riskColor + '"></div></div>' +
      (comp.fullAddress ? '<div style="margin-top:8px;font-size:13px;color:#64748b">&#x1F4CD; ' + comp.fullAddress + '</div>' : '');
  } catch(err) {
    panel.innerHTML = '<div style="color:#dc2626">Error loading details</div>';
  }
}
        `}} />
      </body>
    </html>
  );
}

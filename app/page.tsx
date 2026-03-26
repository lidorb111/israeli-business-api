export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: 'system-ui', maxWidth: 800, margin: '0 auto' }}>
      <h1>Israeli Business Lookup API</h1>
      <p>Search 722,000+ Israeli companies from the official Companies Registry.</p>
      <h2>Endpoints</h2>
      <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
{`GET /api/v1/business/search?id=513695478
GET /api/v1/business/search?name=google
GET /api/v1/business/search?name=טלעד&limit=5`}
      </pre>
      <p>
        <a href="https://rapidapi.com">Get API Key on RapidAPI →</a>
      </p>
    </div>
  );
}

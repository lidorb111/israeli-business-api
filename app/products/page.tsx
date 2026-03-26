import Link from 'next/link';
import { products } from '../../lib/products-catalog';

export const metadata = {
  title: 'Products Catalog | Behar Systems',
  description: '30-day challenge product catalog. One focused digital tool per day.',
};

export default function ProductsCatalogPage() {
  const liveCount = products.filter((p) => p.status === 'live').length;

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <section style={{ marginBottom: 30 }}>
        <p style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: '#2563eb', fontWeight: 700 }}>
          30 Day Product Challenge
        </p>
        <h1 style={{ fontSize: 44, margin: '8px 0 12px' }}>Digital Product Catalog</h1>
        <p style={{ fontSize: 18, color: '#475569', maxWidth: 760 }}>
          Every day we launch one standalone product page with a simple outcome, demo flow, and checkout path.
        </p>
        <div style={{ marginTop: 16, display: 'inline-block', padding: '8px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 999 }}>
          <strong>Progress:</strong> Day {liveCount} of 30 live
        </div>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {products.map((product) => {
          const isLive = product.status === 'live';

          return (
            <article
              key={product.slug}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: 20,
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#334155' }}>Day {product.day}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: 999,
                    background: isLive ? '#dcfce7' : '#e2e8f0',
                    color: isLive ? '#166534' : '#334155',
                  }}
                >
                  {isLive ? 'Live' : 'Coming Soon'}
                </span>
              </div>

              <h2 style={{ fontSize: 24, marginBottom: 8 }}>{product.name}</h2>
              <p style={{ color: '#475569', minHeight: 48 }}>{product.oneLiner}</p>
              <p style={{ marginTop: 12, color: '#0f172a', fontSize: 14 }}>
                <strong>Category:</strong> {product.category}
              </p>
              <p style={{ marginTop: 4, color: '#0f172a', fontSize: 14 }}>
                <strong>Price:</strong> {product.priceLabel}
              </p>

              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link
                  href={`/products/${product.slug}`}
                  style={{
                    textDecoration: 'none',
                    background: '#0f172a',
                    color: '#fff',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Open Product Page
                </Link>
                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    style={{
                      textDecoration: 'none',
                      background: '#f8fafc',
                      color: '#0f172a',
                      border: '1px solid #cbd5e1',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Demo
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

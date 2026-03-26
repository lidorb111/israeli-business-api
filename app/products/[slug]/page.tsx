import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, products } from '../../../lib/products-catalog';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isLive = product.status === 'live';

  return (
    <main>
      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">Behar Systems</Link>
          <div className="nav-links">
            <Link href="/products" className="nav-link">Products</Link>
            <a href="https://github.com/lidorb111/israeli-business-api" className="nav-link">Docs</a>
            <a href="https://rapidapi.com/team/behar-system-behar-system-default" className="nav-link">Pricing</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 100px' }}>
        <Link href="/products" className="detail-back">
          ‹ Products
        </Link>

        <section className="detail-hero">
          <p style={{ fontSize: 12, color: '#86868b', fontWeight: 500, marginBottom: 8 }}>Day {product.day}</p>
          <h1>{product.name}</h1>
          <p>{product.oneLiner}</p>

          <div className="detail-badges">
            <span className={`detail-badge ${isLive ? 'detail-badge-live' : ''}`}>
              {isLive ? 'Available Now' : 'Coming Soon'}
            </span>
            <span className="detail-badge detail-badge-blue">{product.category}</span>
            <span className="detail-badge">{product.priceLabel}</span>
          </div>
        </section>

        <section className="detail-card" style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: '#86868b', marginBottom: 16 }}>
            <strong style={{ color: '#1d1d1f' }}>Audience:</strong> {product.audience}
          </p>

          <h2>What you get</h2>
          <ul>
            {product.valuePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <div className="detail-actions">
            {product.demoUrl && (
              <a href={product.demoUrl} className="btn-primary">
                Try Demo <span style={{ fontSize: 20 }}>›</span>
              </a>
            )}
            <a
              href={product.rapidApiUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ background: '#1d1d1f' }}
            >
              RapidAPI <span style={{ fontSize: 20 }}>›</span>
            </a>
            {product.apifyUrl && (
              <a
                href={product.apifyUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                Apify <span style={{ fontSize: 20 }}>›</span>
              </a>
            )}
          </div>
        </section>
      </div>

      <footer className="footer">
        <p>© 2025 Behar Systems. All rights reserved.</p>
      </footer>
    </main>
  );
}

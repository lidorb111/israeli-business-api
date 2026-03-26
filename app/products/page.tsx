import Link from 'next/link';
import { products } from '../../lib/products-catalog';

export const metadata = {
  title: 'Products | Behar Systems',
  description: '30-day challenge — one focused digital tool per day for Israeli business data.',
};

export default function ProductsCatalogPage() {
  const liveCount = products.filter((p) => p.status === 'live').length;

  return (
    <main>
      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">Behar Systems</Link>
          <div className="nav-links">
            <Link href="/products" className="nav-link" style={{ opacity: 1 }}>Products</Link>
            <a href="https://github.com/lidorb111/israeli-business-api" className="nav-link">Docs</a>
            <a href="https://rapidapi.com/team/behar-system-behar-system-default" className="nav-link">Pricing</a>
          </div>
        </div>
      </nav>

      <section className="catalog-hero">
        <h1>Products.</h1>
        <p>
          Every day we ship one focused API tool. Simple to use, built for production.
        </p>
        <div className="catalog-progress">
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158' }} />
          Day {liveCount} of 30 live
        </div>
      </section>

      <section className="product-grid">
        {products.map((product, i) => {
          const isLive = product.status === 'live';

          return (
            <article
              key={product.slug}
              className={`product-card animate-fade-in-up delay-${Math.min(i + 1, 7)}`}
            >
              <div className="product-card-header">
                <span className="product-day">Day {product.day}</span>
                <span className={isLive ? 'badge-live' : 'badge-soon'}>
                  {isLive ? 'Live' : 'Coming Soon'}
                </span>
              </div>

              <h2>{product.name}</h2>
              <p className="desc">{product.oneLiner}</p>

              <div className="product-meta">
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.priceLabel}</span>
              </div>

              <div className="product-card-actions">
                <Link href={`/products/${product.slug}`} className="btn-card-primary">
                  Learn More
                </Link>
                {product.demoUrl && (
                  <a href={product.demoUrl} className="btn-card-secondary">
                    Try Demo
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <footer className="footer">
        <p>© 2025 Behar Systems. All rights reserved.</p>
      </footer>
    </main>
  );
}

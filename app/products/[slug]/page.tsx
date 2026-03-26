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
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <Link href="/products" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
        ← Back to Catalog
      </Link>

      <section style={{ marginTop: 18, border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
        <p style={{ marginBottom: 6, color: '#334155', fontSize: 13 }}>Day {product.day}</p>
        <h1 style={{ fontSize: 40, margin: '0 0 8px' }}>{product.name}</h1>
        <p style={{ color: '#475569', fontSize: 18, marginBottom: 14 }}>{product.oneLiner}</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: '5px 10px',
              borderRadius: 999,
              background: isLive ? '#dcfce7' : '#e2e8f0',
              color: isLive ? '#166534' : '#334155',
            }}
          >
            {isLive ? 'Live' : 'Coming Soon'}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 999, background: '#eff6ff', color: '#1d4ed8' }}>
            {product.category}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 999, background: '#f8fafc', color: '#334155' }}>
            {product.priceLabel}
          </span>
        </div>

        <p style={{ marginBottom: 16 }}>
          <strong>Audience:</strong> {product.audience}
        </p>

        <h2 style={{ fontSize: 20, marginBottom: 8 }}>What this product does</h2>
        <ul style={{ margin: '0 0 20px 20px' }}>
          {product.valuePoints.map((point) => (
            <li key={point} style={{ marginBottom: 6 }}>
              {point}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {product.demoUrl && (
            <a
              href={product.demoUrl}
              style={{
                textDecoration: 'none',
                background: '#0f172a',
                color: '#fff',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Open Demo
            </a>
          )}

          <a
            href={product.rapidApiUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: 'none',
              background: '#2563eb',
              color: '#fff',
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            RapidAPI Listing
          </a>

          {product.apifyUrl && (
            <a
              href={product.apifyUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                background: '#f8fafc',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Apify Listing
            </a>
          )}
        </div>
      </section>
    </main>
  );
}

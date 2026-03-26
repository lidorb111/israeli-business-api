'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved) setLang(saved);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'he' : 'en';
    setLang(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = {
    en: {
      nav_brand: 'Behar Systems',
      nav_products: 'Products',
      nav_docs: 'Docs',
      nav_pricing: 'Pricing',
      hero_badge: 'Introducing: 30 Products in 30 Days',
      hero_h1_1: 'Israeli Business',
      hero_h1_2: 'Data APIs.',
      hero_desc: 'Powerful, developer-friendly APIs for Israeli business data. Company validation, risk scoring, and enrichment — powered by real-time government data.',
      hero_cta1: 'Explore Products',
      hero_cta2: 'View Documentation',
      stats_companies: 'Companies indexed',
      stats_queries: 'Monthly queries',
      stats_uptime: 'Uptime SLA',
      howworks_h2: 'Built to be simple.',
      howworks_desc: 'Three steps to integrate Israeli business data into your product.',
      step1_title: 'Register',
      step1_desc: 'Create an account and receive your API key instantly. No credit card required.',
      step2_title: 'Integrate',
      step2_desc: 'Simple REST APIs with comprehensive documentation. Works with any stack.',
      step3_title: 'Scale',
      step3_desc: 'From prototype to production. Real-time data with 99.9% uptime guarantee.',
      platforms_h2: 'Available everywhere.',
      platforms_desc: 'Integrated with the platforms developers already use.',
      cta_h2: 'Start building today.',
      cta_desc: 'Join developers using Behar Systems APIs to power their applications.',
      cta_btn1: 'Get Started Free',
      cta_btn2: 'Contact Sales',
      footer: '© 2025 Behar Systems. All rights reserved.',
    },
    he: {
      nav_brand: 'בהאר סיסטמס',
      nav_products: 'מוצרים',
      nav_docs: 'תיעוד',
      nav_pricing: 'מחירים',
      hero_badge: 'חדש: 30 מוצרים ב-30 ימים',
      hero_h1_1: 'ממשקי API',
      hero_h1_2: 'לעסקים בישראל.',
      hero_desc: 'ממשקי API חזקים וידידותיים למפתחים. אימות חברות, ניקוד סיכון והעשרת נתונים — מונעים על ידי נתונים ממשלתיים בזמן אמת.',
      hero_cta1: 'לכל המוצרים',
      hero_cta2: 'לתיעוד',
      stats_companies: 'חברות במאגר',
      stats_queries: 'בקשות חודשיות',
      stats_uptime: 'זמינות מובטחת',
      howworks_h2: 'בנוי להיות פשוט.',
      howworks_desc: 'שלושה צעדים לשילוב נתוני עסקים ישראליים במוצר שלך.',
      step1_title: 'הרשמה',
      step1_desc: 'צור חשבון וקבל מפתח API מיידית. ללא כרטיס אשראי.',
      step2_title: 'שילוב',
      step2_desc: 'REST APIs פשוטים עם תיעוד מלא. עובד עם כל טכנולוגיה.',
      step3_title: 'התרחבות',
      step3_desc: 'מפרוטוטיפ לפרודקשן. נתונים בזמן אמת עם 99.9% זמינות.',
      platforms_h2: 'זמין בכל מקום.',
      platforms_desc: 'משולב עם הפלטפורמות שמפתחים כבר משתמשים בהן.',
      cta_h2: 'התחל לבנות היום.',
      cta_desc: 'הצטרף למפתחים שמשתמשים ב-APIs של Behar Systems.',
      cta_btn1: 'התחלה חינמית',
      cta_btn2: 'צור קשר',
      footer: '© 2025 בהאר סיסטמס. כל הזכויות שמורות.',
    },
  };

  const c = t[lang as keyof typeof t];

  return (
    <main dir={lang === 'he' ? 'rtl' : 'ltr'}>
      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            {c.nav_brand}
          </Link>
          <div className="nav-links">
            <Link href="/products" className="nav-link">{c.nav_products}</Link>
            <a href="https://github.com/lidorb111/israeli-business-api" className="nav-link">{c.nav_docs}</a>
            <a href="https://rapidapi.com/team/behar-system-behar-system-default" className="nav-link">{c.nav_pricing}</a>
            <button onClick={toggleLang} className="lang-btn">
              {lang === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge animate-fade-in-up delay-1">
          <div className="hero-badge-dot" />
          {c.hero_badge}
        </div>
        <h1 className="animate-fade-in-up delay-2">
          {c.hero_h1_1}{' '}
          <span className="hero-gradient">{c.hero_h1_2}</span>
        </h1>
        <p className="animate-fade-in-up delay-3">
          {c.hero_desc}
        </p>
        <div className="hero-buttons animate-fade-in-up delay-4">
          <Link href="/products" className="btn-primary">
            {c.hero_cta1} <span style={{ fontSize: '20px' }}>›</span>
          </Link>
          <a href="https://github.com/lidorb111/israeli-business-api" className="btn-secondary">
            {c.hero_cta2} <span style={{ fontSize: '20px' }}>›</span>
          </a>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-row animate-fade-in-up delay-5">
        <div className="stat">
          <div className="stat-value">500K+</div>
          <div className="stat-label">{c.stats_companies}</div>
        </div>
        <div className="stat">
          <div className="stat-value">10M+</div>
          <div className="stat-label">{c.stats_queries}</div>
        </div>
        <div className="stat">
          <div className="stat-value">99.9%</div>
          <div className="stat-label">{c.stats_uptime}</div>
        </div>
      </div>

      {/* How it works */}
      <section className="section-gray">
        <div className="section">
          <h2 className="section-title">{c.howworks_h2}</h2>
          <p className="section-subtitle">{c.howworks_desc}</p>
          <div className="steps-grid">
            {[
              { num: '1', title: c.step1_title, desc: c.step1_desc },
              { num: '2', title: c.step2_title, desc: c.step2_desc },
              { num: '3', title: c.step3_title, desc: c.step3_desc },
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="section">
        <h2 className="section-title">{c.platforms_h2}</h2>
        <p className="section-subtitle">{c.platforms_desc}</p>
        <div className="platform-row">
          {[
            { name: 'RapidAPI', icon: '⚡', desc: 'API Marketplace' },
            { name: 'Apify', icon: '🤖', desc: 'Web Scraping' },
            { name: 'GitHub', icon: '⭐', desc: 'Open Source' },
          ].map((p) => (
            <div key={p.name} className="platform-card">
              <div className="platform-icon">{p.icon}</div>
              <div className="platform-name">{p.name}</div>
              <div className="platform-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>{c.cta_h2}</h2>
        <p>{c.cta_desc}</p>
        <div className="cta-buttons">
          <Link href="/products" className="btn-cta-primary">
            {c.cta_btn1}
          </Link>
          <a href="mailto:hello@beharsystems.com" className="btn-cta-secondary">
            {c.cta_btn2} <span style={{ fontSize: '20px' }}>›</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>{c.footer}</p>
      </footer>
    </main>
  );
}

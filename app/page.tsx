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
      nav_docs: 'Documentation',
      nav_pricing: 'Pricing',
      nav_cta: 'Get Started',
      hero_badge: 'New: 30 Products in 30 Days',
      hero_h1_1: 'Israeli Business',
      hero_h1_2: 'Data APIs',
      hero_desc: 'Powerful, developer-friendly APIs for Israeli business data. From company validation to risk scoring, powered by real-time government data.',
      hero_cta1: 'Explore Products',
      hero_cta2: 'View Docs',
      stats_companies: 'Companies',
      stats_queries: 'Queries/Month',
      stats_uptime: 'Uptime',
      products_label: 'Our Products',
      products_h2: 'Built for Israeli Businesses',
      products_desc: 'A curated collection of APIs solving real business challenges. New products launching daily.',
      products_view: 'View All',
      howworks_h2: 'How It Works',
      howworks_step1_title: 'Register',
      howworks_step1_desc: 'Sign up and get your API key in minutes',
      howworks_step2_title: 'Integrate',
      howworks_step2_desc: 'Use our REST APIs in your application',
      howworks_step3_title: 'Scale',
      howworks_step3_desc: 'Grow with real-time data and analytics',
      platforms_h2: 'Available On',
      platforms_desc: 'Integrated with leading developer platforms',
      rapidapi: 'RapidAPI',
      apify: 'Apify',
      cta_h2: 'Ready to get started?',
      cta_desc: 'Join hundreds of developers using Behar Systems APIs today.',
      cta_btn1: 'Browse Products',
      cta_btn2: 'Contact Us',
      footer_copyright: '© 2025 Behar Systems. All rights reserved.',
    },
    he: {
      nav_brand: 'בהאר סיסטמס',
      nav_products: 'מוצרים',
      nav_docs: 'תיעוד',
      nav_pricing: 'מחירים',
      nav_cta: 'התחל עכשיו',
      hero_badge: '30 מוצרים ב-30 ימים',
      hero_h1_1: 'ממשקי API',
      hero_h1_2: 'לעסקים בישראל',
      hero_desc: 'ממשקי API חזקים וידידותיים למפתחים לנתוני עסקים בישראל. מוודוא חברות ועד ניקוד סיכון, המופעלים בנתונים ממשלתיים עדכניים.',
      hero_cta1: 'כל המוצרים',
      hero_cta2: 'תיעוד',
      stats_companies: 'חברות',
      stats_queries: 'בקשות/חודש',
      stats_uptime: 'יעילות',
      products_label: 'המוצרים שלנו',
      products_h2: 'בנוי לעסקים בישראל',
      products_desc: 'אוסף של APIs המפתרים אתגרים אמיתיים. מוצרים חדשים מושקים כל יום.',
      products_view: 'הצג הכל',
      howworks_h2: 'איך זה עובד',
      howworks_step1_title: 'הרשמה',
      howworks_step1_desc: 'הירשם קבל את חיבור ה-API שלך בדקות',
      howworks_step2_title: 'שיבוץ',
      howworks_step2_desc: 'השתמש ב-REST APIs שלנו ביישום שלך',
      howworks_step3_title: 'גדול',
      howworks_step3_desc: 'גדל עם נתונים ואנליטיקה בזמן אמת',
      platforms_h2: 'זמין ב',
      platforms_desc: 'משולב עם פלטפורמות מובילות למפתחים',
      rapidapi: 'RapidAPI',
      apify: 'Apify',
      cta_h2: 'מוכן להתחיל?',
      cta_desc: 'הצטרף למאות מפתחים המשתמשים ב-Behar Systems APIs היום.',
      cta_btn1: 'כל המוצרים',
      cta_btn2: 'צור קשר',
      footer_copyright: '© 2025 בהאר סיסטמס. כל הזכויות שמורות.',
    },
  };

  const content = t[lang as keyof typeof t];

  return (
    <main style={{ background: '#fff', color: '#0f172a' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 700, letterSpacing: '-.5px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>B</div>
          <span>{content.nav_brand}</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/products" style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, transition: 'all .2s' }} onMouseOver={(e) => (e.currentTarget.style.color = '#0f172a')} onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}>
            {content.nav_products}
          </Link>
          <a href="https://github.com/lidorb111/israeli-business-api" style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, transition: 'all .2s' }} onMouseOver={(e) => (e.currentTarget.style.color = '#0f172a')} onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}>
            {content.nav_docs}
          </a>
          <a href="https://rapidapi.com/team/behar-system-behar-system-default" style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, transition: 'all .2s' }} onMouseOver={(e) => (e.currentTarget.style.color = '#0f172a')} onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}>
            {content.nav_pricing}
          </a>
          <button onClick={toggleLang} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#0f172a', padding: '8px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all .2s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}>
            {lang === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1', padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, marginBottom: '28px' }}>
          <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          {content.hero_badge}
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '20px' }}>
          {content.hero_h1_1} <span style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{content.hero_h1_2}</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#64748b', lineHeight: 1.7, fontWeight: 300, maxWidth: '600px', margin: '0 auto 40px' }}>
          {content.hero_desc}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/products" style={{ background: '#0f172a', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all .2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#2563eb'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#0f172a'; }}>
            {content.hero_cta1} →
          </Link>
          <a href="https://github.com/lidorb111/israeli-business-api" style={{ background: '#f8fafc', color: '#0f172a', padding: '16px 36px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: '1px solid #e2e8f0', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all .2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; }}>
            {content.hero_cta2}
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', padding: '40px', marginTop: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>500+</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{content.stats_companies}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>10M+</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{content.stats_queries}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>99.9%</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{content.stats_uptime}</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#f8fafc', padding: '80px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '48px' }}>{content.howworks_h2}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {[
              { num: '1', title: content.howworks_step1_title, desc: content.howworks_step1_desc },
              { num: '2', title: content.howworks_step2_title, desc: content.howworks_step2_desc },
              { num: '3', title: content.howworks_step3_title, desc: content.howworks_step3_desc },
            ].map((step) => (
              <div key={step.num} style={{ padding: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0f172a', color: '#fff', fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>{content.platforms_h2}</h2>
        <p style={{ color: '#64748b', fontSize: '17px', marginBottom: '48px' }}>{content.platforms_desc}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {[
            { name: 'RapidAPI', icon: '⚡', desc: 'API Marketplace' },
            { name: 'Apify', icon: '🤖', desc: 'Web Scraping' },
            { name: 'GitHub', icon: '⭐', desc: 'Open Source' },
          ].map((platform) => (
            <div key={platform.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px 32px', border: '1px solid #f0f0f5', borderRadius: '16px', minWidth: '160px', transition: 'all .2s', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.04)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#f0f0f5'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '28px' }}>{platform.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{platform.name}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{platform.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0f172a', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>{content.cta_h2}</h2>
        <p style={{ color: '#94a3b8', fontSize: '17px', marginBottom: '36px' }}>{content.cta_desc}</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/products" style={{ background: '#2563eb', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all .2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#3b82f6'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#2563eb'; }}>
            {content.cta_btn1}
          </Link>
          <a href="mailto:hello@beharsystems.com" style={{ background: 'rgba(255,255,255,.06)', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,.1)', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all .2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; }}>
            {content.cta_btn2}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f8fafc', padding: '32px 40px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>{content.footer_copyright}</p>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </main>
  );
}

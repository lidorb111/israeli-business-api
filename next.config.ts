import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://www.paypal.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://translate.googleapis.com; frame-src https://www.paypal.com https://translate.google.com;" },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;

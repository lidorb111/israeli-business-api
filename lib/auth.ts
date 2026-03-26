import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

const ALLOWED_ORIGINS = [
  'https://israeli-business-api.vercel.app',
  'https://mashkantaspro.com',
  'https://www.mashkantaspro.com',
];

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function corsHeaders(origin?: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

export function jsonError(message: string, status: number, code: string) {
  return NextResponse.json(
    { success: false, error: message, code },
    { status, headers: corsHeaders() }
  );
}

export function checkAuth(req: NextRequest): boolean {
  const proxySecret = req.headers.get('x-rapidapi-proxy-secret');
  const apiKey = req.headers.get('x-api-key');
  const envProxy = process.env.RAPIDAPI_PROXY_SECRET;
  const envKey = process.env.API_SECRET_KEY;

  // RapidAPI proxy authentication (timing-safe)
  if (proxySecret && envProxy && safeCompare(proxySecret, envProxy)) {
    return true;
  }

  // Direct API key authentication (timing-safe)
  if (apiKey && envKey && safeCompare(apiKey, envKey)) {
    return true;
  }

  // Development mode — only if explicitly set
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return false;
}

// Rate limiter — simple in-memory per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute

export function checkRateLimit(req: NextRequest): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return false;
  }

  return true;
}

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetAt) rateLimitMap.delete(key);
  }
}, 60 * 1000);

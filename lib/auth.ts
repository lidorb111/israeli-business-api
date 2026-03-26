import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

const ALLOWED_ORIGINS = [
  'https://israeli-business-api.vercel.app',
  'https://mashkantaspro.com',
  'https://www.mashkantaspro.com',
  'https://beharsystems.com',
  'https://www.beharsystems.com',
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
    'Access-Control-Max-Age': '86400',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-DNS-Prefetch-Control': 'off',
  };
}

/** Standard OPTIONS preflight response */
export function handleOptions(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
}

export function jsonError(message: string, status: number, code: string) {
  return NextResponse.json(
    { success: false, error: message, code },
    { status, headers: corsHeaders() }
  );
}

/** Safely parse JSON body; returns [parsed, null] on success or [null, errorResponse] on failure */
export async function safeJsonParse(req: NextRequest): Promise<[Record<string, unknown> | null, NextResponse | null]> {
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return [null, jsonError('Content-Type must be application/json', 415, 'INVALID_CONTENT_TYPE')];
  }
  try {
    const body = await req.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return [null, jsonError('Request body must be a JSON object', 400, 'INVALID_BODY')];
    }
    return [body as Record<string, unknown>, null];
  } catch {
    return [null, jsonError('Invalid JSON in request body', 400, 'INVALID_JSON')];
  }
}

/** Validate and clamp a numeric ID from query string */
export function parseNumericId(raw: string | null): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\D/g, '');
  if (!cleaned || cleaned.length > 15) return null;
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}

/** Sanitize and limit length of query string inputs */
export function sanitizeQuery(raw: string | null, maxLen = 200): string {
  if (!raw) return '';
  return raw.replace(/[<>"'`\\]/g, '').substring(0, maxLen).trim();
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

/** Validate a webhook URL against SSRF attacks */
export function validateWebhookUrl(raw: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return 'Invalid URL format';
  }

  if (parsed.protocol !== 'https:') {
    return 'webhookUrl must use HTTPS';
  }

  // Block credentials in URL
  if (parsed.username || parsed.password) {
    return 'webhookUrl must not contain credentials';
  }

  const host = parsed.hostname.toLowerCase();

  // Block localhost / loopback
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1' ||
      host === '0.0.0.0' || host === '[::1]' || host === '0000:0000:0000:0000:0000:0000:0000:0001') {
    return 'webhookUrl cannot point to localhost';
  }

  // Block private IPv4 ranges (RFC 1918)
  if (host.startsWith('10.') || host.startsWith('192.168.')) {
    return 'webhookUrl cannot point to private addresses';
  }
  // 172.16.0.0 - 172.31.255.255
  if (host.startsWith('172.')) {
    const secondOctet = parseInt(host.split('.')[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) {
      return 'webhookUrl cannot point to private addresses';
    }
  }

  // Block link-local
  if (host.startsWith('169.254.') || host.startsWith('fe80')) {
    return 'webhookUrl cannot point to link-local addresses';
  }

  // Block IPv6 private/reserved (fc00::/7 = unique local, fe80::/10 = link-local)
  if (host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80')) {
    return 'webhookUrl cannot point to private IPv6 addresses';
  }

  // Block cloud metadata endpoints
  if (host === '169.254.169.254' || host === 'metadata.google.internal' ||
      host === 'metadata.google.com' || host.endsWith('.internal') || host.endsWith('.local')) {
    return 'webhookUrl cannot point to internal/metadata endpoints';
  }

  // Block common internal hostnames
  if (host === 'kubernetes.default' || host === 'kubernetes.default.svc' || host.endsWith('.svc.cluster.local')) {
    return 'webhookUrl cannot point to cluster-internal addresses';
  }

  return null; // valid
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

// Clean up rate limit map periodically (cap map size to prevent memory exhaustion)
const RATE_LIMIT_MAP_MAX_SIZE = 10_000;
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetAt) rateLimitMap.delete(key);
  }
  // Emergency purge if map grows too large (DDoS protection)
  if (rateLimitMap.size > RATE_LIMIT_MAP_MAX_SIZE) {
    rateLimitMap.clear();
  }
}, 60 * 1000);

import { NextRequest, NextResponse } from 'next/server';

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret',
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
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    isDev ||
    (!!proxySecret && !!envProxy && proxySecret === envProxy) ||
    (!!apiKey && !!envKey && apiKey === envKey)
  );
}

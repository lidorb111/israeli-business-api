import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  const proxySecret = req.headers.get('x-rapidapi-proxy-secret');
  const apiKey = req.headers.get('x-api-key');
  const envProxy = process.env.RAPIDAPI_PROXY_SECRET;
  const envKey = process.env.API_SECRET_KEY;
  return NextResponse.json({
    receivedApiKey: apiKey?.substring(0, 8) || null,
    envKeyFirst8: envKey?.substring(0, 8) || null,
    keyMatch: apiKey === envKey,
    receivedProxy: proxySecret?.substring(0, 8) || null,
    envProxyFirst8: envProxy?.substring(0, 8) || null,
    proxyMatch: proxySecret === envProxy,
  });
}

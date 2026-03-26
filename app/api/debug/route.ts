import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({
    hasProxySecret: !!process.env.RAPIDAPI_PROXY_SECRET,
    hasApiKey: !!process.env.API_SECRET_KEY,
    proxyLen: process.env.RAPIDAPI_PROXY_SECRET?.length || 0,
    apiKeyLen: process.env.API_SECRET_KEY?.length || 0,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { getAllWatches, updateWatchStatus } from '@/lib/watch-store';
import { queryCompanies, mapRecord } from '@/lib/data-gov';
import { validateWebhookUrl } from '@/lib/auth';

// GET /api/cron/check-status — called by Vercel Cron daily
// Checks all watched companies for status changes and fires webhooks
export async function GET(req: NextRequest) {
  // Verify cron secret — ALWAYS required
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const watches = getAllWatches();
  if (watches.length === 0) {
    return NextResponse.json({ checked: 0, changes: 0 });
  }

  let changes = 0;

  for (const watch of watches) {
    try {
      const data = await queryCompanies({ id: watch.companyId, limit: 1 });
      if (!data.result.records.length) continue;

      const company = mapRecord(data.result.records[0]);
      const currentStatus = String(company.status || '');

      // If status changed since last check
      if (watch.lastStatus && currentStatus !== watch.lastStatus) {
        changes++;
        // Re-validate webhook URL before firing (defense in depth against SSRF)
        const urlError = validateWebhookUrl(watch.webhookUrl);
        if (urlError) {
          console.error(`Skipping webhook for ${watch.companyId}: ${urlError}`);
          continue;
        }
        // Fire webhook with timeout
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          await fetch(watch.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'BeharSystems-Webhook/1.0' },
            body: JSON.stringify({
              event: 'status_changed',
              companyId: watch.companyId,
              companyName: company.companyName,
              previousStatus: watch.lastStatus,
              currentStatus,
              timestamp: new Date().toISOString(),
            }),
            signal: controller.signal,
          });
          clearTimeout(timeout);
        } catch {
          // Webhook delivery failed — logged but not thrown
        }
      }

      updateWatchStatus(watch.id, currentStatus);
    } catch {
      // Individual company check failed — continue with next
    }
  }

  return NextResponse.json({
    checked: watches.length,
    changes,
    timestamp: new Date().toISOString(),
  });
}

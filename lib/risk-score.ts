/**
 * Calculate risk score (0-100) for an Israeli company based on public data.
 * Higher = safer. Lower = riskier.
 */

export function calculateRiskScore(company: Record<string, unknown>): {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: Array<{ factor: string; impact: number; detail: string }>;
} {
  const factors: Array<{ factor: string; impact: number; detail: string }> = [];
  let score = 100;

  // 1. Company status
  const status = String(company.status || '');
  if (status === 'פעילה') {
    factors.push({ factor: 'status', impact: 0, detail: 'Company is active' });
  } else if (status.includes('פירוק') || status.includes('מחיקה')) {
    score -= 50;
    factors.push({ factor: 'status', impact: -50, detail: `Company status: ${status}` });
  } else if (status.includes('מחוקה')) {
    score -= 80;
    factors.push({ factor: 'status', impact: -80, detail: 'Company is dissolved' });
  } else {
    score -= 20;
    factors.push({ factor: 'status', impact: -20, detail: `Unusual status: ${status}` });
  }

  // 2. Violator flag
  const violator = String(company.violator || '');
  if (violator === 'מפרה' || violator.includes('מפר')) {
    score -= 25;
    factors.push({ factor: 'violator', impact: -25, detail: 'Company is flagged as violator by registrar' });
  }

  // 3. Annual report recency
  const lastReport = Number(company.lastAnnualReportYear || 0);
  const currentYear = new Date().getFullYear();
  if (lastReport > 0) {
    const yearsSinceReport = currentYear - lastReport;
    if (yearsSinceReport <= 1) {
      factors.push({ factor: 'reporting', impact: 0, detail: 'Annual report is up to date' });
    } else if (yearsSinceReport <= 3) {
      score -= 10;
      factors.push({ factor: 'reporting', impact: -10, detail: `Last annual report: ${lastReport} (${yearsSinceReport} years ago)` });
    } else {
      score -= 20;
      factors.push({ factor: 'reporting', impact: -20, detail: `Last annual report: ${lastReport} (${yearsSinceReport} years ago)` });
    }
  } else {
    score -= 15;
    factors.push({ factor: 'reporting', impact: -15, detail: 'No annual report on file' });
  }

  // 4. Company age
  const incDate = String(company.incorporationDate || '');
  if (incDate) {
    const parts = incDate.split('/');
    if (parts.length === 3) {
      const year = parseInt(parts[2]);
      const age = currentYear - year;
      if (age >= 10) {
        score += 5;
        factors.push({ factor: 'age', impact: 5, detail: `Established ${age} years ago — well established` });
      } else if (age >= 3) {
        factors.push({ factor: 'age', impact: 0, detail: `Established ${age} years ago` });
      } else {
        score -= 5;
        factors.push({ factor: 'age', impact: -5, detail: `New company (${age} years old)` });
      }
    }
  }

  // 5. Government company (usually low risk)
  if (company.isGovernment === 'כן') {
    score += 10;
    factors.push({ factor: 'government', impact: 10, detail: 'Government-owned company' });
  }

  // 6. Limitations
  const limitations = String(company.limitations || '');
  if (limitations === 'מוגבלת') {
    factors.push({ factor: 'limitations', impact: 0, detail: 'Limited liability — standard' });
  } else if (limitations.includes('לא')) {
    score -= 5;
    factors.push({ factor: 'limitations', impact: -5, detail: 'Unlimited liability or unknown' });
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine level
  let level: 'low' | 'medium' | 'high' | 'critical';
  if (score >= 75) level = 'low';
  else if (score >= 50) level = 'medium';
  else if (score >= 25) level = 'high';
  else level = 'critical';

  return { score, level, factors };
}

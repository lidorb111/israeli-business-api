/**
 * Israeli ID / Company Number validation using Luhn-like algorithm.
 * Works for: תעודת זהות (ID), חברה פרטית (Company), עוסק מורשה, עמותה
 */

export function validateIsraeliId(id: string): {
  valid: boolean;
  type: 'individual' | 'company' | 'nonprofit' | 'partnership' | 'unknown';
  formatted: string;
  checkDigit: number;
} {
  // Clean input
  const cleaned = id.replace(/\D/g, '');

  // Must be 9 digits (pad with leading zeros if needed)
  const padded = cleaned.padStart(9, '0');

  if (padded.length !== 9) {
    return { valid: false, type: 'unknown', formatted: cleaned, checkDigit: -1 };
  }

  // Luhn-like check digit algorithm for Israeli IDs
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(padded[i]) * ((i % 2) + 1);
    if (digit > 9) digit -= 9;
    sum += digit;
  }

  const valid = sum % 10 === 0;
  const checkDigit = parseInt(padded[8]);

  // Determine type based on prefix
  const prefix = parseInt(padded[0]);
  let type: 'individual' | 'company' | 'nonprofit' | 'partnership' | 'unknown';

  if (prefix === 5 && parseInt(padded[1]) >= 1 && parseInt(padded[1]) <= 5) {
    type = 'company'; // 51x-55x = companies
  } else if (prefix === 5 && parseInt(padded[1]) >= 6 && parseInt(padded[1]) <= 9) {
    type = 'nonprofit'; // 56x-59x = nonprofits/partnerships
  } else if (prefix === 0 || prefix === 1 || prefix === 2 || prefix === 3) {
    type = 'individual'; // 0xx-3xx = individuals
  } else {
    type = 'unknown';
  }

  return { valid, type, formatted: padded, checkDigit };
}

export function validateBatch(ids: string[]): Array<{
  input: string;
  valid: boolean;
  type: string;
  formatted: string;
}> {
  return ids.map((id) => {
    const result = validateIsraeliId(id);
    return {
      input: id,
      valid: result.valid,
      type: result.type,
      formatted: result.formatted,
    };
  });
}

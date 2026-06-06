import type { SplitRule } from './types';

export type ValidationResult = { ok: true } | { ok: false; reason: string };

export function validateSplit(total: number, rule: SplitRule): ValidationResult {
  if (total <= 0) return { ok: false, reason: 'Amount must be greater than zero' };

  switch (rule.type) {
    case 'equal':
      if (rule.participantIds.length === 0) {
        return { ok: false, reason: 'Pick at least one participant' };
      }
      return { ok: true };

    case 'shares': {
      const total_ = sumValues(rule.shares);
      if (total_ <= 0) return { ok: false, reason: 'Shares must sum to more than zero' };
      if (Object.values(rule.shares).some((s) => s < 0)) {
        return { ok: false, reason: 'Shares cannot be negative' };
      }
      return { ok: true };
    }

    case 'percent': {
      if (Object.values(rule.percents).some((p) => p < 0)) {
        return { ok: false, reason: 'Percents cannot be negative' };
      }
      const sum = sumValues(rule.percents);
      if (Math.round(sum * 100) !== 10000) {
        return { ok: false, reason: `Percents must sum to 100 (got ${sum})` };
      }
      return { ok: true };
    }

    case 'exact': {
      if (Object.values(rule.amounts).some((a) => a < 0)) {
        return { ok: false, reason: 'Amounts cannot be negative' };
      }
      const sum = sumValues(rule.amounts);
      if (sum !== total) {
        return { ok: false, reason: `Amounts must sum to ${total} (got ${sum})` };
      }
      return { ok: true };
    }

    case 'itemized': {
      if (rule.items.length === 0) {
        return { ok: false, reason: 'Add at least one line item' };
      }
      const sum = rule.items.reduce((acc, item) => acc + item.amount, 0);
      if (sum !== total) {
        return { ok: false, reason: `Line items must sum to ${total} (got ${sum})` };
      }
      for (const item of rule.items) {
        const res = validateSplit(item.amount, item.split);
        if (!res.ok) return { ok: false, reason: `Item "${item.description}": ${res.reason}` };
      }
      return { ok: true };
    }
  }
}

function sumValues(record: Record<string, number>): number {
  return Object.values(record).reduce((a, b) => a + b, 0);
}

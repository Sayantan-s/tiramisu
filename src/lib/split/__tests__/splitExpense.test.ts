import { splitExpense, splitByRule } from '../splitExpense';
import { validateSplit } from '../validation';
import type { Expense, SplitRule } from '../types';

const baseExpense = (split: SplitRule, amount = 10000): Expense => ({
  id: 'e1',
  householdId: 'h1',
  amount,
  currency: 'INR',
  payerId: 'alice',
  paidAt: '2026-06-01T00:00:00.000Z',
  category: 'groceries',
  source: 'manual',
  split,
  createdAt: '2026-06-01T00:00:00.000Z',
  createdBy: 'alice',
});

const sum = (shares: Record<string, number>) =>
  Object.values(shares).reduce((a, b) => a + b, 0);

describe('splitExpense — equal', () => {
  it('splits evenly with no remainder', () => {
    const shares = splitExpense(
      baseExpense({ type: 'equal', participantIds: ['a', 'b', 'c', 'd'] }, 1000),
    );
    expect(shares).toEqual({ a: 250, b: 250, c: 250, d: 250 });
  });

  it('distributes paise remainder deterministically', () => {
    const shares = splitExpense(
      baseExpense({ type: 'equal', participantIds: ['carol', 'alice', 'bob'] }, 100),
    );
    expect(sum(shares)).toBe(100);
    expect(shares.alice).toBe(34);
    expect(shares.bob).toBe(33);
    expect(shares.carol).toBe(33);
  });

  it('returns empty for empty participants', () => {
    const shares = splitExpense(baseExpense({ type: 'equal', participantIds: [] }, 1000));
    expect(shares).toEqual({});
  });

  it('handles single participant', () => {
    const shares = splitExpense(baseExpense({ type: 'equal', participantIds: ['solo'] }, 999));
    expect(shares).toEqual({ solo: 999 });
  });
});

describe('splitExpense — shares', () => {
  it('splits by weighted shares with exact total', () => {
    const shares = splitExpense(
      baseExpense({ type: 'shares', shares: { alice: 2, bob: 1, carol: 1 } }, 4000),
    );
    expect(shares).toEqual({ alice: 2000, bob: 1000, carol: 1000 });
    expect(sum(shares)).toBe(4000);
  });

  it('distributes remainder paise', () => {
    const shares = splitExpense(
      baseExpense({ type: 'shares', shares: { alice: 1, bob: 1, carol: 1 } }, 1001),
    );
    expect(sum(shares)).toBe(1001);
  });
});

describe('splitExpense — percent', () => {
  it('splits exactly to total when percents sum to 100', () => {
    const shares = splitExpense(
      baseExpense({ type: 'percent', percents: { alice: 50, bob: 30, carol: 20 } }, 10000),
    );
    expect(sum(shares)).toBe(10000);
    expect(shares.alice).toBe(5000);
    expect(shares.bob).toBe(3000);
    expect(shares.carol).toBe(2000);
  });

  it('handles odd remainder cleanly', () => {
    const shares = splitExpense(
      baseExpense({ type: 'percent', percents: { alice: 33, bob: 33, carol: 34 } }, 100),
    );
    expect(sum(shares)).toBe(100);
  });
});

describe('splitExpense — exact', () => {
  it('returns amounts as-is', () => {
    const shares = splitExpense(
      baseExpense({ type: 'exact', amounts: { alice: 600, bob: 400 } }, 1000),
    );
    expect(shares).toEqual({ alice: 600, bob: 400 });
  });
});

describe('splitExpense — itemized', () => {
  it('aggregates line items', () => {
    const shares = splitExpense(
      baseExpense(
        {
          type: 'itemized',
          items: [
            {
              id: 'i1',
              description: "Bob's beer",
              amount: 400,
              split: { type: 'exact', amounts: { bob: 400 } },
            },
            {
              id: 'i2',
              description: 'Shared food',
              amount: 1700,
              split: { type: 'equal', participantIds: ['alice', 'bob', 'carol', 'dev'] },
            },
          ],
        },
        2100,
      ),
    );
    expect(sum(shares)).toBe(2100);
    expect(shares.bob).toBe(400 + 425);
    expect(shares.alice).toBe(425);
  });
});

describe('splitByRule — direct', () => {
  it('matches splitExpense output', () => {
    const rule: SplitRule = { type: 'equal', participantIds: ['a', 'b'] };
    expect(splitByRule(1000, rule)).toEqual(splitExpense(baseExpense(rule, 1000)));
  });
});

describe('property: total preserved across many random splits', () => {
  const seedRand = (s: number) => () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  it('equal: always sums to total for 100 random cases', () => {
    const rand = seedRand(1);
    for (let i = 0; i < 100; i++) {
      const total = Math.floor(rand() * 1_000_000) + 1;
      const n = Math.floor(rand() * 5) + 1;
      const ids = Array.from({ length: n }, (_, k) => `m${k}`);
      const shares = splitByRule(total, { type: 'equal', participantIds: ids });
      expect(sum(shares)).toBe(total);
    }
  });

  it('shares: always sums to total for 100 random cases', () => {
    const rand = seedRand(2);
    for (let i = 0; i < 100; i++) {
      const total = Math.floor(rand() * 1_000_000) + 1;
      const weights: Record<string, number> = {};
      const n = Math.floor(rand() * 5) + 1;
      for (let k = 0; k < n; k++) {
        weights[`m${k}`] = Math.floor(rand() * 5) + 1;
      }
      const shares = splitByRule(total, { type: 'shares', shares: weights });
      expect(sum(shares)).toBe(total);
    }
  });
});

describe('validateSplit', () => {
  it('rejects zero or negative amount', () => {
    const res = validateSplit(0, { type: 'equal', participantIds: ['a'] });
    expect(res.ok).toBe(false);
  });

  it('rejects equal split with no participants', () => {
    const res = validateSplit(1000, { type: 'equal', participantIds: [] });
    expect(res.ok).toBe(false);
  });

  it('rejects percents not summing to 100', () => {
    const res = validateSplit(1000, { type: 'percent', percents: { a: 50, b: 30 } });
    expect(res.ok).toBe(false);
  });

  it('accepts percents summing to 100', () => {
    const res = validateSplit(1000, { type: 'percent', percents: { a: 50, b: 50 } });
    expect(res.ok).toBe(true);
  });

  it('rejects exact split not summing to total', () => {
    const res = validateSplit(1000, { type: 'exact', amounts: { a: 400, b: 400 } });
    expect(res.ok).toBe(false);
  });

  it('accepts exact split summing to total', () => {
    const res = validateSplit(1000, { type: 'exact', amounts: { a: 400, b: 600 } });
    expect(res.ok).toBe(true);
  });

  it('rejects itemized with mismatched sum', () => {
    const res = validateSplit(1000, {
      type: 'itemized',
      items: [
        {
          id: '1',
          description: 'x',
          amount: 400,
          split: { type: 'equal', participantIds: ['a'] },
        },
      ],
    });
    expect(res.ok).toBe(false);
  });

  it('accepts itemized with matching sum', () => {
    const res = validateSplit(1000, {
      type: 'itemized',
      items: [
        {
          id: '1',
          description: 'x',
          amount: 1000,
          split: { type: 'equal', participantIds: ['a'] },
        },
      ],
    });
    expect(res.ok).toBe(true);
  });
});

import { computeBalances } from '../computeBalances';
import { minimizeTransfers } from '../minimizeTransfers';
import type { Expense, Settlement, SplitRule } from '../../split/types';

const expense = (
  id: string,
  payerId: string,
  amount: number,
  split: SplitRule,
): Expense => ({
  id,
  householdId: 'h1',
  amount,
  currency: 'INR',
  payerId,
  paidAt: '2026-06-01T00:00:00.000Z',
  category: 'groceries',
  source: 'manual',
  split,
  createdAt: '2026-06-01T00:00:00.000Z',
  createdBy: payerId,
});

describe('computeBalances', () => {
  it('returns zero balance for an empty household', () => {
    expect(computeBalances([], [], ['a', 'b'])).toEqual({ a: 0, b: 0 });
  });

  it('payer gets +total, participants get -share', () => {
    const e = expense('1', 'alice', 1000, {
      type: 'equal',
      participantIds: ['alice', 'bob'],
    });
    const balances = computeBalances([e], [], ['alice', 'bob']);
    expect(balances.alice).toBe(1000 - 500);
    expect(balances.bob).toBe(-500);
  });

  it('balances sum to zero across the group', () => {
    const expenses: Expense[] = [
      expense('1', 'alice', 4000, {
        type: 'equal',
        participantIds: ['alice', 'bob', 'carol', 'dev'],
      }),
      expense('2', 'bob', 1200, {
        type: 'equal',
        participantIds: ['alice', 'bob', 'carol'],
      }),
      expense('3', 'carol', 3450, {
        type: 'shares',
        shares: { alice: 2, bob: 1, carol: 1, dev: 1 },
      }),
    ];
    const balances = computeBalances(expenses, [], ['alice', 'bob', 'carol', 'dev']);
    const total = Object.values(balances).reduce((a, b) => a + b, 0);
    expect(total).toBe(0);
  });

  it('settlements zero out the pair', () => {
    const e = expense('1', 'alice', 1000, {
      type: 'equal',
      participantIds: ['alice', 'bob'],
    });
    const settlement: Settlement = {
      id: 's1',
      householdId: 'h1',
      fromId: 'bob',
      toId: 'alice',
      amount: 500,
      paidAt: '2026-06-02T00:00:00.000Z',
      createdAt: '2026-06-02T00:00:00.000Z',
    };
    const balances = computeBalances([e], [settlement], ['alice', 'bob']);
    expect(balances).toEqual({ alice: 0, bob: 0 });
  });
});

describe('minimizeTransfers', () => {
  it('produces empty list when all balanced', () => {
    expect(minimizeTransfers({ a: 0, b: 0, c: 0 })).toEqual([]);
  });

  it('settles a simple two-person debt', () => {
    const transfers = minimizeTransfers({ alice: 500, bob: -500 });
    expect(transfers).toEqual([{ fromId: 'bob', toId: 'alice', amount: 500 }]);
  });

  it('uses N-1 transfers max for typical balances', () => {
    const transfers = minimizeTransfers({ alice: 600, bob: -200, carol: -400 });
    expect(transfers.length).toBeLessThanOrEqual(2);
    const credit: Record<string, number> = {};
    for (const t of transfers) {
      credit[t.toId] = (credit[t.toId] ?? 0) + t.amount;
      credit[t.fromId] = (credit[t.fromId] ?? 0) - t.amount;
    }
    expect(credit.alice).toBe(600);
    expect(credit.bob).toBe(-200);
    expect(credit.carol).toBe(-400);
  });

  it('round-trip: applying transfers zeros balances', () => {
    const balances = { a: 1000, b: -300, c: -700 };
    const transfers = minimizeTransfers(balances);
    const post = { ...balances };
    for (const t of transfers) {
      post[t.fromId as keyof typeof post] += t.amount;
      post[t.toId as keyof typeof post] -= t.amount;
    }
    expect(post.a).toBe(0);
    expect(post.b).toBe(0);
    expect(post.c).toBe(0);
  });

  it('handles four-person mixed balances', () => {
    const balances = { alice: 3000, bob: -1000, carol: -500, dev: -1500 };
    const transfers = minimizeTransfers(balances);
    expect(transfers.length).toBeLessThanOrEqual(3);
    const post: Record<string, number> = { ...balances };
    for (const t of transfers) {
      post[t.fromId] += t.amount;
      post[t.toId] -= t.amount;
    }
    expect(Object.values(post).every((b) => b === 0)).toBe(true);
  });
});

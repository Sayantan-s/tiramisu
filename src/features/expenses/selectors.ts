import { computeBalances, minimizeTransfers, type Transfer } from '../../lib/settle';
import type { Expense, MemberId, Settlement } from '../../lib/split/types';
import { monthKey } from '../../lib/format/date';

export const expensesInMonth = (expenses: Expense[], month: string): Expense[] =>
  expenses.filter((e) => monthKey(e.paidAt) === month);

export const settlementsInMonth = (settlements: Settlement[], month: string): Settlement[] =>
  settlements.filter((s) => monthKey(s.paidAt) === month);

export const totalSpent = (expenses: Expense[]): number =>
  expenses.reduce((sum, e) => sum + e.amount, 0);

export const byCategory = (expenses: Expense[]): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const e of expenses) out[e.category] = (out[e.category] ?? 0) + e.amount;
  return out;
};

export const topCategories = (
  expenses: Expense[],
  n: number,
): Array<{ category: string; amount: number }> => {
  const totals = byCategory(expenses);
  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n);
};

export const balancesForMonth = (
  expenses: Expense[],
  settlements: Settlement[],
  memberIds: MemberId[],
  month: string,
): Record<MemberId, number> => {
  return computeBalances(
    expensesInMonth(expenses, month),
    settlementsInMonth(settlements, month),
    memberIds,
  );
};

export const transfersForMonth = (
  expenses: Expense[],
  settlements: Settlement[],
  memberIds: MemberId[],
  month: string,
): Transfer[] => minimizeTransfers(balancesForMonth(expenses, settlements, memberIds, month));

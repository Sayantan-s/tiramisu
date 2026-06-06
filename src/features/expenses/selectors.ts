import type { ExpenseDto, SettlementDto } from '../../lib/api';
import { splitByRule } from '../../lib/split';
import { monthKey } from '../../lib/format/date';

export const expensesInMonth = (expenses: ExpenseDto[], month: string): ExpenseDto[] =>
  expenses.filter((e) => monthKey(e.paid_at) === month);

export const settlementsInMonth = (settlements: SettlementDto[], month: string): SettlementDto[] =>
  settlements.filter((s) => monthKey(s.paid_at) === month);

export const totalSpent = (expenses: ExpenseDto[]): number =>
  expenses.reduce((sum, e) => sum + e.amount, 0);

export const byCategory = (expenses: ExpenseDto[]): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const e of expenses) out[e.category] = (out[e.category] ?? 0) + e.amount;
  return out;
};

export const topCategories = (
  expenses: ExpenseDto[],
  n: number,
): Array<{ category: string; amount: number }> => {
  const totals = byCategory(expenses);
  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n);
};

export const computeBalancesFromDto = (
  expenses: ExpenseDto[],
  settlements: SettlementDto[],
  memberIds: string[],
): Record<string, number> => {
  const balances: Record<string, number> = {};
  for (const id of memberIds) balances[id] = 0;
  for (const e of expenses) {
    balances[e.payer_id] = (balances[e.payer_id] ?? 0) + e.amount;
    const shares = splitByRule(e.amount, e.split);
    for (const [id, owed] of Object.entries(shares)) {
      balances[id] = (balances[id] ?? 0) - owed;
    }
  }
  for (const s of settlements) {
    balances[s.from_id] = (balances[s.from_id] ?? 0) + s.amount;
    balances[s.to_id] = (balances[s.to_id] ?? 0) - s.amount;
  }
  return balances;
};

import { splitExpense } from '../split/splitExpense';
import type { Expense, MemberId, Settlement } from '../split/types';

export type Balances = Record<MemberId, number>;

export function computeBalances(
  expenses: Expense[],
  settlements: Settlement[],
  memberIds: MemberId[],
): Balances {
  const balances: Balances = {};
  for (const id of memberIds) balances[id] = 0;

  for (const expense of expenses) {
    balances[expense.payerId] = (balances[expense.payerId] ?? 0) + expense.amount;
    const shares = splitExpense(expense);
    for (const [id, owed] of Object.entries(shares)) {
      balances[id] = (balances[id] ?? 0) - owed;
    }
  }

  for (const settlement of settlements) {
    balances[settlement.fromId] = (balances[settlement.fromId] ?? 0) + settlement.amount;
    balances[settlement.toId] = (balances[settlement.toId] ?? 0) - settlement.amount;
  }

  return balances;
}

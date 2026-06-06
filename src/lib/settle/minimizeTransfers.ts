import type { MemberId } from '../split/types';
import type { Balances } from './computeBalances';

export type Transfer = {
  fromId: MemberId;
  toId: MemberId;
  amount: number;
};

export function minimizeTransfers(balances: Balances): Transfer[] {
  const creditors: Array<{ id: MemberId; amount: number }> = [];
  const debtors: Array<{ id: MemberId; amount: number }> = [];

  for (const [id, balance] of Object.entries(balances)) {
    if (balance > 0) creditors.push({ id, amount: balance });
    else if (balance < 0) debtors.push({ id, amount: -balance });
  }

  creditors.sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));
  debtors.sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));

  const transfers: Transfer[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];
    const settle = Math.min(creditor.amount, debtor.amount);
    if (settle > 0) {
      transfers.push({ fromId: debtor.id, toId: creditor.id, amount: settle });
    }
    creditor.amount -= settle;
    debtor.amount -= settle;
    if (creditor.amount === 0) ci += 1;
    if (debtor.amount === 0) di += 1;
  }

  return transfers;
}

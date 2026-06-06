import type { Expense, MemberId, NonItemizedSplit, SplitRule } from './types';

export type Shares = Record<MemberId, number>;

export function splitExpense(expense: Expense): Shares {
  return splitByRule(expense.amount, expense.split);
}

export function splitByRule(total: number, rule: SplitRule): Shares {
  if (rule.type === 'itemized') {
    const shares: Shares = {};
    for (const item of rule.items) {
      const itemShares = splitByRule(item.amount, item.split);
      for (const [id, amt] of Object.entries(itemShares)) {
        shares[id] = (shares[id] ?? 0) + amt;
      }
    }
    return shares;
  }
  return splitNonItemized(total, rule);
}

function splitNonItemized(total: number, rule: NonItemizedSplit): Shares {
  switch (rule.type) {
    case 'equal':
      return divideEvenly(total, rule.participantIds);
    case 'shares':
      return divideByWeights(total, rule.shares);
    case 'percent':
      return divideByPercents(total, rule.percents);
    case 'exact':
      return { ...rule.amounts };
  }
}

function divideEvenly(total: number, ids: MemberId[]): Shares {
  if (ids.length === 0) return {};
  const sorted = [...ids].sort();
  const weights: Record<MemberId, number> = {};
  for (const id of sorted) weights[id] = 1;
  return divideByWeights(total, weights);
}

function divideByWeights(total: number, weights: Record<MemberId, number>): Shares {
  const ids = Object.keys(weights).sort();
  const totalWeight = ids.reduce((sum, id) => sum + weights[id], 0);
  if (totalWeight <= 0) return {};

  const shares: Shares = {};
  let allocated = 0;
  for (const id of ids) {
    const share = Math.floor((total * weights[id]) / totalWeight);
    shares[id] = share;
    allocated += share;
  }

  let remainder = total - allocated;
  let i = 0;
  while (remainder > 0) {
    const id = ids[i % ids.length];
    shares[id] += 1;
    remainder -= 1;
    i += 1;
  }
  return shares;
}

function divideByPercents(total: number, percents: Record<MemberId, number>): Shares {
  return divideByWeights(total, percents);
}

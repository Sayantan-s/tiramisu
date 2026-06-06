export type MemberId = string;

export type Member = {
  id: MemberId;
  name: string;
  avatar?: string;
};

export type SplitRule =
  | { type: 'equal'; participantIds: MemberId[] }
  | { type: 'shares'; shares: Record<MemberId, number> }
  | { type: 'percent'; percents: Record<MemberId, number> }
  | { type: 'exact'; amounts: Record<MemberId, number> }
  | { type: 'itemized'; items: LineItem[] };

export type NonItemizedSplit = Exclude<SplitRule, { type: 'itemized' }>;

export type LineItem = {
  id: string;
  description: string;
  amount: number;
  split: NonItemizedSplit;
};

export type ExpenseCategory =
  | 'rent'
  | 'utilities'
  | 'groceries'
  | 'household'
  | 'food'
  | 'other';

export type ExpenseSource = 'manual' | 'receipt' | 'sms';

export type RecurringInfo = {
  cadence: 'monthly';
  nextDueIso: string;
};

export type Expense = {
  id: string;
  householdId: string;
  amount: number;
  currency: 'INR';
  payerId: MemberId;
  paidAt: string;
  category: ExpenseCategory;
  description?: string;
  receiptUri?: string;
  ocrConfidence?: number;
  source: ExpenseSource;
  recurring?: RecurringInfo;
  split: SplitRule;
  createdAt: string;
  createdBy: MemberId;
};

export type Settlement = {
  id: string;
  householdId: string;
  fromId: MemberId;
  toId: MemberId;
  amount: number;
  paidAt: string;
  note?: string;
  createdAt: string;
};

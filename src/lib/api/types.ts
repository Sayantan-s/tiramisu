import type { SplitRule } from '../split';

export type UserDto = {
  id: string;
  phone: string;
  name: string;
  avatar: string | null;
  created_at: string;
};

export type MemberDto = {
  id: string;
  name: string;
  avatar: string | null;
  role: 'owner' | 'member';
  joined_at: string;
};

export type GroupDto = {
  id: string;
  kind: 'roomies' | 'trips';
  name: string;
  icon: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  members: MemberDto[];
};

export type InviteDto = {
  code: string;
  group_id: string;
  expires_at: string;
  max_uses: number;
  used_count: number;
};

export type ExpenseDto = {
  id: string;
  group_id: string;
  amount: number;
  currency: string;
  payer_id: string;
  paid_at: string;
  category: string;
  description: string | null;
  receipt_uri: string | null;
  source: 'manual' | 'receipt' | 'sms';
  split: SplitRule;
  recurring: { cadence: 'monthly'; nextDueIso: string } | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type SettlementDto = {
  id: string;
  group_id: string;
  from_id: string;
  to_id: string;
  amount: number;
  paid_at: string;
  note: string | null;
  created_by: string;
  created_at: string;
};

export type EventDto = {
  id: string;
  group_id: string;
  month: string;
  kind:
    | 'expense_added'
    | 'expense_updated'
    | 'expense_deleted'
    | 'settlement_recorded'
    | 'settlement_deleted'
    | 'comment'
    | 'member_joined'
    | 'month_closed';
  actor_id: string;
  subject_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};

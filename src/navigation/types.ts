import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Phone: undefined;
  Otp: undefined;
};

export type ModeStackParamList = {
  ModeHub: undefined;
  GroupsList: undefined;
  CreateGroup: undefined;
  JoinGroup: { prefill?: string } | undefined;
};

export type ExpensePrefill = {
  amount?: number;
  description?: string;
  category?: string;
  payer_id?: string;
  receipt_uri?: string;
  source?: 'manual' | 'receipt' | 'sms';
};

export type GroupStackParamList = {
  Tabs: undefined;
  InvitePeople: undefined;
  AddExpense: { prefill?: ExpensePrefill } | undefined;
  ExpenseDetail: { expenseId: string };
  ConfirmCapture: { imageUri: string };
  Members: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Mode: NavigatorScreenParams<ModeStackParamList>;
  Group: NavigatorScreenParams<GroupStackParamList>;
};

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PaymentHint } from '../lib/sms/types';

export type ExpensePrefill = {
  amount?: number;
  description?: string;
  category?: string;
  payerId?: string;
  receiptUri?: string;
  source?: 'manual' | 'receipt' | 'sms';
  fromHint?: PaymentHint;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  AddExpense: { prefill?: ExpensePrefill } | undefined;
  ExpenseDetail: { expenseId: string };
  ConfirmCapture: { imageUri: string };
  ProfileSwitcher: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Expenses: undefined;
  Scan: undefined;
  Settle: undefined;
};

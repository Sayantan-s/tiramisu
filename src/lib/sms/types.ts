export type PaymentHintSender = 'HDFC' | 'GPay' | 'PhonePe' | 'Paytm' | 'SBI' | 'ICICI';

export type PaymentHint = {
  id: string;
  sender: PaymentHintSender;
  receivedAt: string;
  amount: number;
  counterparty: string;
  rawBody: string;
};

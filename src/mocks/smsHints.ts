import type { PaymentHint } from '../lib/sms/types';

const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const seededHints = (): PaymentHint[] => [
  {
    id: 'hint_1',
    sender: 'GPay',
    receivedAt: daysAgo(1),
    amount: 240000,
    counterparty: 'BLR Landlord',
    rawBody: 'You paid ₹2,400.00 to BLR Landlord via UPI Ref 401923.',
  },
  {
    id: 'hint_2',
    sender: 'PhonePe',
    receivedAt: daysAgo(2),
    amount: 154000,
    counterparty: 'Nature Basket',
    rawBody: 'Money sent ₹1,540 to NATURE BASKET. UPI Txn ID T2026...',
  },
  {
    id: 'hint_3',
    sender: 'HDFC',
    receivedAt: daysAgo(3),
    amount: 78900,
    counterparty: 'BESCOM',
    rawBody: 'Rs.789 debited from a/c XX1234 to BESCOM via NEFT.',
  },
  {
    id: 'hint_4',
    sender: 'GPay',
    receivedAt: daysAgo(5),
    amount: 62000,
    counterparty: 'Swiggy',
    rawBody: 'You paid ₹620.00 to Swiggy via UPI.',
  },
];

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '../../lib/storage/zustandStorage';
import { seededHints } from '../../mocks/smsHints';
import type { PaymentHint } from '../../lib/sms/types';

type SmsState = {
  hints: PaymentHint[];
  dismissedIds: string[];
  initFromSeed: () => void;
  dismiss: (id: string) => void;
  reset: () => void;
};

export const useSmsStore = create<SmsState>()(
  persist(
    (set, get) => ({
      hints: [],
      dismissedIds: [],
      initFromSeed: () => {
        if (get().hints.length === 0) set({ hints: seededHints() });
      },
      dismiss: (id) => set({ dismissedIds: [...get().dismissedIds, id] }),
      reset: () => set({ hints: seededHints(), dismissedIds: [] }),
    }),
    { name: 'tiramisu:sms:v1', storage: zustandStorage },
  ),
);

export const computeActiveHints = (
  hints: PaymentHint[],
  dismissedIds: string[],
): PaymentHint[] => {
  if (dismissedIds.length === 0) return hints;
  const set = new Set(dismissedIds);
  return hints.filter((h) => !set.has(h.id));
};

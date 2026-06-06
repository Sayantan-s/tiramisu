import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '../../lib/storage/zustandStorage';
import { uid } from '../../lib/storage/uid';
import type { Settlement } from '../../lib/split/types';

type SettlementsState = {
  settlements: Settlement[];
  recordSettlement: (input: Omit<Settlement, 'id' | 'createdAt'>) => Settlement;
  removeSettlement: (id: string) => void;
  reset: () => void;
};

export const useSettlementsStore = create<SettlementsState>()(
  persist(
    (set, get) => ({
      settlements: [],
      recordSettlement: (input) => {
        const settlement: Settlement = {
          ...input,
          id: uid('s'),
          createdAt: new Date().toISOString(),
        };
        set({ settlements: [...get().settlements, settlement] });
        return settlement;
      },
      removeSettlement: (id) =>
        set((state) => ({ settlements: state.settlements.filter((s) => s.id !== id) })),
      reset: () => set({ settlements: [] }),
    }),
    { name: 'tiramisu:settlements:v1', storage: zustandStorage },
  ),
);

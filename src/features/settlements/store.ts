import { create } from 'zustand';
import { Endpoints, type SettlementDto } from '../../lib/api';
import { uid } from '../../lib/storage/uid';

type SettlementsState = {
  groupId: string | null;
  settlements: SettlementDto[];
  loading: boolean;
  lastError: string | null;

  setGroup: (groupId: string | null) => void;
  refresh: () => Promise<void>;
  recordSettlement: (input: {
    from_id: string;
    to_id: string;
    amount: number;
    paid_at: string;
    note?: string;
  }) => Promise<SettlementDto>;
  removeSettlement: (id: string) => Promise<void>;
  upsertFromSync: (rows: SettlementDto[]) => void;
  reset: () => void;
};

const TEMP_PREFIX = '__pending_';

export const useSettlementsStore = create<SettlementsState>()((set, get) => ({
  groupId: null,
  settlements: [],
  loading: false,
  lastError: null,

  setGroup: (groupId) => {
    if (get().groupId === groupId) return;
    set({ groupId, settlements: [], lastError: null });
  },

  refresh: async () => {
    const { groupId } = get();
    if (!groupId) return;
    set({ loading: true, lastError: null });
    try {
      const rows = await Endpoints.settlements.list(groupId);
      get().upsertFromSync(rows);
      set({ loading: false });
    } catch (err) {
      set({ loading: false, lastError: (err as Error).message });
    }
  },

  recordSettlement: async (input) => {
    const { groupId } = get();
    if (!groupId) throw new Error('No active group');
    const tempId = `${TEMP_PREFIX}${uid('s')}`;
    const now = new Date().toISOString();
    const draft: SettlementDto = {
      id: tempId,
      group_id: groupId,
      from_id: input.from_id,
      to_id: input.to_id,
      amount: input.amount,
      paid_at: input.paid_at,
      note: input.note ?? null,
      created_by: tempId,
      created_at: now,
    };
    set({ settlements: [draft, ...get().settlements] });
    try {
      const real = await Endpoints.settlements.create(groupId, input);
      set({
        settlements: get().settlements.map((s) => (s.id === tempId ? real : s)),
      });
      return real;
    } catch (err) {
      set({ settlements: get().settlements.filter((s) => s.id !== tempId) });
      throw err;
    }
  },

  removeSettlement: async (id) => {
    const { groupId } = get();
    if (!groupId) throw new Error('No active group');
    const before = get().settlements;
    set({ settlements: before.filter((s) => s.id !== id) });
    try {
      await Endpoints.settlements.delete(groupId, id);
    } catch (err) {
      set({ settlements: before });
      throw err;
    }
  },

  upsertFromSync: (rows) => {
    const existing = get().settlements;
    const byId = new Map(existing.map((s) => [s.id, s]));
    for (const row of rows) byId.set(row.id, row);
    const pending = existing.filter((s) => s.id.startsWith(TEMP_PREFIX));
    set({
      settlements: [
        ...pending,
        ...Array.from(byId.values()).filter((s) => !s.id.startsWith(TEMP_PREFIX)),
      ],
    });
  },

  reset: () => set({ groupId: null, settlements: [], loading: false, lastError: null }),
}));

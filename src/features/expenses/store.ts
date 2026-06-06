import { create } from 'zustand';
import { Endpoints, type ExpenseDto } from '../../lib/api';
import { uid } from '../../lib/storage/uid';

type ExpensesState = {
  groupId: string | null;
  expenses: ExpenseDto[];
  loading: boolean;
  lastError: string | null;

  setGroup: (groupId: string | null) => void;
  refresh: () => Promise<void>;
  addExpense: (input: Omit<ExpenseDto, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'group_id'>) => Promise<ExpenseDto>;
  updateExpense: (id: string, input: Partial<ExpenseDto>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  upsertFromSync: (rows: ExpenseDto[]) => void;
  reset: () => void;
};

const TEMP_PREFIX = '__pending_';

export const useExpensesStore = create<ExpensesState>()((set, get) => ({
  groupId: null,
  expenses: [],
  loading: false,
  lastError: null,

  setGroup: (groupId) => {
    if (get().groupId === groupId) return;
    set({ groupId, expenses: [], lastError: null });
  },

  refresh: async () => {
    const { groupId } = get();
    if (!groupId) return;
    set({ loading: true, lastError: null });
    try {
      const rows = await Endpoints.expenses.list(groupId);
      get().upsertFromSync(rows);
      set({ loading: false });
    } catch (err) {
      set({ loading: false, lastError: (err as Error).message });
    }
  },

  addExpense: async (input) => {
    const { groupId } = get();
    if (!groupId) throw new Error('No active group');
    const tempId = `${TEMP_PREFIX}${uid('e')}`;
    const now = new Date().toISOString();
    const draft: ExpenseDto = {
      id: tempId,
      group_id: groupId,
      created_by: tempId,
      created_at: now,
      updated_at: now,
      ...input,
    } as ExpenseDto;

    set({ expenses: [draft, ...get().expenses] });

    try {
      const real = await Endpoints.expenses.create(groupId, input);
      set({
        expenses: get().expenses.map((e) => (e.id === tempId ? real : e)),
      });
      return real;
    } catch (err) {
      set({ expenses: get().expenses.filter((e) => e.id !== tempId) });
      throw err;
    }
  },

  updateExpense: async (id, input) => {
    const { groupId } = get();
    if (!groupId) throw new Error('No active group');
    const before = get().expenses;
    set({ expenses: before.map((e) => (e.id === id ? { ...e, ...input } : e)) });
    try {
      const updated = await Endpoints.expenses.update(groupId, id, input);
      set({ expenses: get().expenses.map((e) => (e.id === id ? updated : e)) });
    } catch (err) {
      set({ expenses: before });
      throw err;
    }
  },

  removeExpense: async (id) => {
    const { groupId } = get();
    if (!groupId) throw new Error('No active group');
    const before = get().expenses;
    set({ expenses: before.filter((e) => e.id !== id) });
    try {
      await Endpoints.expenses.delete(groupId, id);
    } catch (err) {
      set({ expenses: before });
      throw err;
    }
  },

  upsertFromSync: (rows) => {
    const existing = get().expenses;
    const byId = new Map(existing.map((e) => [e.id, e]));
    for (const row of rows) byId.set(row.id, row);
    // Preserve any optimistic drafts that haven't been confirmed yet.
    const pending = existing.filter((e) => e.id.startsWith(TEMP_PREFIX));
    set({
      expenses: [
        ...pending,
        ...Array.from(byId.values()).filter((e) => !e.id.startsWith(TEMP_PREFIX)),
      ],
    });
  },

  reset: () => set({ groupId: null, expenses: [], loading: false, lastError: null }),
}));

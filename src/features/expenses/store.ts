import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '../../lib/storage/zustandStorage';
import { uid } from '../../lib/storage/uid';
import type { Expense } from '../../lib/split/types';

type ExpensesState = {
  expenses: Expense[];
  addExpense: (input: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  updateExpense: (id: string, patch: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  reset: () => void;
};

export const useExpensesStore = create<ExpensesState>()(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (input) => {
        const expense: Expense = {
          ...input,
          id: uid('e'),
          createdAt: new Date().toISOString(),
        };
        set({ expenses: [...get().expenses, expense] });
        return expense;
      },
      updateExpense: (id, patch) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      removeExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
      reset: () => set({ expenses: [] }),
    }),
    { name: 'tiramisu:expenses:v1', storage: zustandStorage },
  ),
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '../../lib/storage/zustandStorage';
import { uid } from '../../lib/storage/uid';
import type { Member, MemberId } from '../../lib/split/types';

type HouseholdState = {
  initialized: boolean;
  householdId: string | null;
  householdName: string;
  members: Member[];
  currentUserId: MemberId | null;

  setup: (input: { householdName: string; members: Array<Omit<Member, 'id'>>; meIndex: number }) => void;
  setCurrentUser: (id: MemberId) => void;
  addMember: (input: Omit<Member, 'id'>) => void;
  removeMember: (id: MemberId) => void;
  reset: () => void;
};

export const useHouseholdStore = create<HouseholdState>()(
  persist(
    (set) => ({
      initialized: false,
      householdId: null,
      householdName: '',
      members: [],
      currentUserId: null,

      setup: ({ householdName, members, meIndex }) => {
        const withIds = members.map((m) => ({ ...m, id: uid('m') }));
        set({
          initialized: true,
          householdId: uid('h'),
          householdName,
          members: withIds,
          currentUserId: withIds[meIndex]?.id ?? withIds[0]?.id ?? null,
        });
      },

      setCurrentUser: (id) => set({ currentUserId: id }),

      addMember: (input) =>
        set((state) => ({
          members: [...state.members, { ...input, id: uid('m') }],
        })),

      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          currentUserId: state.currentUserId === id ? state.members[0]?.id ?? null : state.currentUserId,
        })),

      reset: () =>
        set({
          initialized: false,
          householdId: null,
          householdName: '',
          members: [],
          currentUserId: null,
        }),
    }),
    {
      name: 'tiramisu:household:v1',
      storage: zustandStorage,
    },
  ),
);

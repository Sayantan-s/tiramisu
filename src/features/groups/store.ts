import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '../../lib/storage/zustandStorage';
import { Endpoints, type GroupDto } from '../../lib/api';

type GroupsState = {
  groups: GroupDto[];
  activeGroupId: string | null;
  loading: boolean;
  lastError: string | null;

  setActiveGroup: (id: string | null) => void;
  refresh: () => Promise<void>;
  createGroup: (input: { kind: 'roomies' | 'trips'; name: string; icon?: string }) => Promise<GroupDto>;
  acceptInvite: (code: string) => Promise<GroupDto>;
  leaveGroup: (id: string) => Promise<void>;
  reset: () => void;
};

export const useGroupsStore = create<GroupsState>()(
  persist(
    (set, get) => ({
      groups: [],
      activeGroupId: null,
      loading: false,
      lastError: null,

      setActiveGroup: (id) => set({ activeGroupId: id }),

      refresh: async () => {
        set({ loading: true, lastError: null });
        try {
          const groups = await Endpoints.groups.list();
          set({ groups, loading: false });
        } catch (err) {
          set({ loading: false, lastError: (err as Error).message });
        }
      },

      createGroup: async (input) => {
        const group = await Endpoints.groups.create(input);
        set({ groups: [group, ...get().groups], activeGroupId: group.id });
        return group;
      },

      acceptInvite: async (code) => {
        const group = await Endpoints.invites.accept(code);
        const existing = get().groups.find((g) => g.id === group.id);
        set({
          groups: existing
            ? get().groups.map((g) => (g.id === group.id ? group : g))
            : [group, ...get().groups],
          activeGroupId: group.id,
        });
        return group;
      },

      leaveGroup: async (id) => {
        await Endpoints.groups.leave(id);
        set({
          groups: get().groups.filter((g) => g.id !== id),
          activeGroupId: get().activeGroupId === id ? null : get().activeGroupId,
        });
      },

      reset: () => set({ groups: [], activeGroupId: null, loading: false, lastError: null }),
    }),
    { name: 'tiramisu:groups:v1', storage: zustandStorage },
  ),
);

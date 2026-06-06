import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage/zustandStorage';
import { useAuthStore } from '../features/auth/store';
import { useGroupsStore } from '../features/groups/store';
import { useExpensesStore } from '../features/expenses/store';
import { useSettlementsStore } from '../features/settlements/store';
import { useEventsStore } from '../features/events/store';
import { devEndpoints } from './endpoints';
import type { UserDto } from '../lib/api';

export type Dummy = {
  id: string;
  name: string;
  phone: string;
  avatar: string | null;
  token: string;
  groupId: string;
};

type DevState = {
  dummies: Dummy[];
  realIdentity: { token: string; user: UserDto | null } | null;
  actingAsId: string | null;

  seedRoommate: (name: string) => Promise<Dummy>;
  forgetDummy: (id: string) => void;
  actAs: (dummyId: string) => Promise<void>;
  stopActing: () => Promise<void>;
  reset: () => void;
};

export const useDevStore = create<DevState>()(
  persist(
    (set, get) => ({
      dummies: [],
      realIdentity: null,
      actingAsId: null,

      seedRoommate: async (name) => {
        const groupId = useGroupsStore.getState().activeGroupId;
        if (!groupId) throw new Error('Open a group first');
        const result = await devEndpoints.seedRoommate({ group_id: groupId, name });
        const dummy: Dummy = {
          id: result.user.id,
          name: result.user.name,
          phone: result.user.phone,
          avatar: result.user.avatar,
          token: result.access_token,
          groupId,
        };
        set({ dummies: [...get().dummies, dummy] });
        await useGroupsStore.getState().refresh();
        return dummy;
      },

      forgetDummy: (id) => {
        const next = get().dummies.filter((d) => d.id !== id);
        set({
          dummies: next,
          actingAsId: get().actingAsId === id ? null : get().actingAsId,
        });
      },

      actAs: async (dummyId) => {
        const dummy = get().dummies.find((d) => d.id === dummyId);
        if (!dummy) return;

        const auth = useAuthStore.getState();
        if (!get().realIdentity) {
          if (!auth.token) throw new Error('No real identity to remember');
          set({ realIdentity: { token: auth.token, user: auth.user } });
        }

        useAuthStore.setState({
          token: dummy.token,
          user: {
            id: dummy.id,
            phone: dummy.phone,
            name: dummy.name,
            avatar: dummy.avatar,
            created_at: new Date().toISOString(),
          },
        });
        set({ actingAsId: dummyId });

        useGroupsStore.getState().setActiveGroup(dummy.groupId);
        await useGroupsStore.getState().refresh();
        await useExpensesStore.getState().refresh();
        await useSettlementsStore.getState().refresh();
        await useEventsStore.getState().refresh();
      },

      stopActing: async () => {
        const { realIdentity } = get();
        if (!realIdentity) return;
        useAuthStore.setState({ token: realIdentity.token, user: realIdentity.user });
        set({ realIdentity: null, actingAsId: null });
        await useGroupsStore.getState().refresh();
        await useExpensesStore.getState().refresh();
        await useSettlementsStore.getState().refresh();
        await useEventsStore.getState().refresh();
      },

      reset: () => set({ dummies: [], realIdentity: null, actingAsId: null }),
    }),
    {
      name: 'tiramisu:dev:v1',
      storage: zustandStorage,
      // Persist dummies + acting state; on cold start the dummy tokens stay valid.
    },
  ),
);

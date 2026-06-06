import { create } from 'zustand';
import { Endpoints, type EventDto } from '../../lib/api';

type EventsState = {
  groupId: string | null;
  month: string | null;
  events: EventDto[];
  loading: boolean;
  lastError: string | null;

  setContext: (groupId: string | null, month: string | null) => void;
  refresh: () => Promise<void>;
  postComment: (subjectId: string, body: string) => Promise<EventDto>;
  reset: () => void;
};

export const useEventsStore = create<EventsState>()((set, get) => ({
  groupId: null,
  month: null,
  events: [],
  loading: false,
  lastError: null,

  setContext: (groupId, month) => {
    const same = get().groupId === groupId && get().month === month;
    if (same) return;
    set({ groupId, month, events: [], lastError: null });
  },

  refresh: async () => {
    const { groupId, month } = get();
    if (!groupId || !month) return;
    set({ loading: true, lastError: null });
    try {
      const rows = await Endpoints.events.list(groupId, { month });
      set({ events: rows, loading: false });
    } catch (err) {
      set({ loading: false, lastError: (err as Error).message });
    }
  },

  postComment: async (subjectId, body) => {
    const { groupId } = get();
    if (!groupId) throw new Error('No active group');
    const event = await Endpoints.events.comment(groupId, subjectId, body);
    set({ events: [...get().events, event] });
    return event;
  },

  reset: () => set({ groupId: null, month: null, events: [], loading: false, lastError: null }),
}));

import { create } from 'zustand';

type InvitesState = {
  pendingCode: string | null;
  setPendingCode: (code: string | null) => void;
  consume: () => string | null;
};

export const useInvitesStore = create<InvitesState>((set, get) => ({
  pendingCode: null,
  setPendingCode: (code) => set({ pendingCode: code }),
  consume: () => {
    const code = get().pendingCode;
    if (code) set({ pendingCode: null });
    return code;
  },
}));

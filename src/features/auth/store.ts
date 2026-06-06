import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '../../lib/storage/zustandStorage';
import { configureApi, Endpoints } from '../../lib/api';
import type { UserDto } from '../../lib/api';

type AuthState = {
  token: string | null;
  user: UserDto | null;
  hydrated: boolean;
  pendingPhone: string | null;
  pendingRequestId: string | null;
  setPendingPhone: (phone: string, requestId: string) => void;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string, name?: string) => Promise<void>;
  signOut: () => void;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hydrated: false,
      pendingPhone: null,
      pendingRequestId: null,

      setHydrated: () => set({ hydrated: true }),

      setPendingPhone: (phone, requestId) =>
        set({ pendingPhone: phone, pendingRequestId: requestId }),

      requestOtp: async (phone) => {
        const r = await Endpoints.auth.requestOtp(phone);
        set({ pendingPhone: phone, pendingRequestId: r.request_id });
      },

      verifyOtp: async (otp, name) => {
        const phone = get().pendingPhone;
        if (!phone) throw new Error('No pending phone to verify');
        const r = await Endpoints.auth.verifyOtp(phone, otp, name);
        set({
          token: r.access_token,
          user: r.user,
          pendingPhone: null,
          pendingRequestId: null,
        });
      },

      signOut: () =>
        set({
          token: null,
          user: null,
          pendingPhone: null,
          pendingRequestId: null,
        }),
    }),
    {
      name: 'tiramisu:auth:v1',
      storage: zustandStorage,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

configureApi({
  tokenProvider: () => useAuthStore.getState().token,
  onUnauthorized: () => useAuthStore.getState().signOut(),
});

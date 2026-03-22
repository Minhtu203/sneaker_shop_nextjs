import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserInfo {
  _id: string;
  username: string;
  accessToken: string;
  role: 'admin' | 'user';
  avatar?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
}

interface UserState {
  userInfo: UserInfo | null;
  role: 'admin' | 'user' | '';
  loading: boolean;
  setUserInfo: (data: UserInfo | null) => void;
  clearUserInfo: () => void;
  setLoading: (status?: boolean) => void;
}

export const useUserState = create<UserState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      role: '',
      loading: false,

      setUserInfo: (data) =>
        set({
          userInfo: data,
          role: data?.role,
        }),

      clearUserInfo: () =>
        set({
          userInfo: null,
          role: '',
        }),

      setLoading: (status) => {
        const currentLoading = get().loading;
        set({ loading: status ?? !currentLoading });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getUserState = () => useUserState.getState();

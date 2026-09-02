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
  setUserInfo: (data: Partial<UserInfo> | null) => void;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set((state: any) => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...data } : data,
          role: data?.role ?? state.role,
        })),

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

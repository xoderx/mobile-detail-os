import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export type UserRole = 'admin' | 'tech' | 'customer';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
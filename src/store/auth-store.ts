import { create } from 'zustand';
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
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth-session');
  },
}));
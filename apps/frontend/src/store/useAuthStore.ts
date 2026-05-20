import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setUser: (user, token) => set({ user, token, isLoggedIn: true }),

      login: async (email, password) => {
        const response = await axios.post(
          `${API}/auth/login`,
          { email, password },
          { withCredentials: true }
        );
        const { user, token } = response.data;
        set({ user, token, isLoggedIn: true });
        // Token is now auto-attached via apiClient interceptor — no need to set axios.defaults
      },

      logout: async () => {
        try {
          await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        } catch { /* ignore */ }
        set({ user: null, token: null, isLoggedIn: false });
      },
    }),
    {
      name: "dsib-auth",
      partialize: (state) => ({ user: state.user, token: state.token, isLoggedIn: state.isLoggedIn }),
    }
  )
);

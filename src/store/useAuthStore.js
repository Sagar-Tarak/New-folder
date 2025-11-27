import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      // Auth state
      token: null,
      isAuthenticated: false,

      // Save token & mark as logged in
      login: (token) => {
        set({ token, isAuthenticated: true });
      },

      // Clear token & log out
      logout: () => {
        set({ token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // key used in localStorage
    }
  )
);

export default useAuthStore;

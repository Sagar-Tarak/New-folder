import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,

      // Login action
      login: (token) => {
        set({ token, isAuthenticated: true })
      },

      // Logout action
      logout: () => {
        set({ token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
    }
  )
)

export default useAuthStore

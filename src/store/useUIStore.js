import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUIStore = create(
  persist(
    (set) => ({
      isSidebarOpen: true,
      
      // Toggle sidebar
      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
      },

      // Set sidebar state explicitly
      setSidebarOpen: (isOpen) => {
        set({ isSidebarOpen: isOpen })
      },
    }),
    {
      name: 'ui-storage', // unique name for localStorage key
    }
  )
)

export default useUIStore

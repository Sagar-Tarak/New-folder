import { create } from 'zustand'

// Initialize sidebar open state based on viewport width so mobile starts closed
const isDesktop = typeof globalThis !== 'undefined' && globalThis.window?.innerWidth >= 768

const useUIStore = create((set) => ({
  isSidebarOpen: isDesktop,

  // Toggle sidebar
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
  },

  // Set sidebar state explicitly
  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen })
  },
}))

export default useUIStore

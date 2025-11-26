import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import merchantsData from '../data/merchants.json'

const useMerchantStore = create(
  persist(
    (set) => ({
      merchants: [],
      loading: false,

      // Initialize merchants from persisted data or default data
      initializeMerchants: () => {
        set((state) => {
          // If already initialized with persisted data, don't override
          if (state.merchants.length > 0) {
            return { loading: false }
          }
          // Otherwise use default data
          return { merchants: merchantsData, loading: false }
        })
      },

      // Set loading state
      setLoading: (loading) => set({ loading }),

      // Add a new merchant
      addMerchant: (merchant) => {
        set((state) => ({
          merchants: [...state.merchants, merchant],
        }))
      },

      // Remove a merchant by id
      removeMerchant: (id) => {
        set((state) => ({
          merchants: state.merchants.filter((m) => m.id !== id),
        }))
      },

      // Update a merchant
      updateMerchant: (id, updates) => {
        set((state) => ({
          merchants: state.merchants.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }))
      },

      // Get merchant by id
      getMerchantById: (id) => (state) => {
        return state.merchants.find((m) => m.id === id)
      },
    }),
    {
      name: 'merchants-storage', // unique name for localStorage key
    }
  )
)

export default useMerchantStore

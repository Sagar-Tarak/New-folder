import { create } from "zustand";
import { persist } from "zustand/middleware";
import merchantsData from "../data/merchants.json";

const useMerchantStore = create(
  persist(
    (set) => ({
      merchants: [],
      loading: false,

      // Load merchants (only once)
      initializeMerchants: () => {
        set((state) => {
          // If store already has data (from persist), don't replace it
          if (state.merchants.length > 0) {
            return { loading: false };
          }

          // Otherwise load the default JSON data
          return {
            merchants: merchantsData,
            loading: false,
          };
        });
      },

      // Update loading state
      setLoading: (value) => set({ loading: value }),

      // Add new merchant
      addMerchant: (merchant) => {
        set((state) => ({
          merchants: [...state.merchants, merchant],
        }));
      },

      // Delete merchant by ID
      removeMerchant: (id) => {
        set((state) => ({
          merchants: state.merchants.filter((m) => m.id !== id),
        }));
      },

      // Update merchant by ID
      updateMerchant: (id, updates) => {
        set((state) => ({
          merchants: state.merchants.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      // Get merchant by ID (selector style)
      getMerchantById: (id) => (state) =>
        state.merchants.find((m) => m.id === id),
    }),
    {
      name: "merchants-storage", // key for localStorage
    }
  )
);

export default useMerchantStore;

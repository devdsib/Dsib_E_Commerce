import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  brand?: string;
  category?: string;
}

interface WishlistStore {
  items: WishlistProduct[];
  addItem: (product: WishlistProduct) => void;
  removeItem: (id: string) => void;
  toggleItem: (product: WishlistProduct) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          if (state.items.find((i) => i.id === product.id)) return state;
          return { items: [...state.items, product] };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      toggleItem: (product) => {
        const exists = get().items.find((i) => i.id === product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isWishlisted: (id) => !!get().items.find((i) => i.id === id),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "dsib-wishlist" }
  )
);

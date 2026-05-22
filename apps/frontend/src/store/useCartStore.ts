import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  brand: string;
  quantity: number;
  stock: number;
  gstPercentage: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number; // exclusive
  gstAmount: () => number;
  total: () => number; // inclusive
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1, gstPercentage: item.gstPercentage || 18 }] });
        }
        set({ isCartOpen: true });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.discountPrice ?? i.price) * i.quantity,
          0
        ),

      gstAmount: () =>
        get().items.reduce(
          (sum, i) => sum + (i.discountPrice ?? i.price) * i.quantity * ((i.gstPercentage || 18) / 100),
          0
        ),

      total: () => get().subtotal() + get().gstAmount(),
    }),
    {
      name: "dsib-cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

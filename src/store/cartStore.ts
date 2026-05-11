import { create } from 'zustand';

import type { MenuItem } from '../types/food';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    const existingItem = get().items.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      set({
        items: get().items.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      });
      return;
    }

    set({ items: [...get().items, { ...item, quantity: 1 }] });
  },
  incrementItem: (itemId) =>
    set({
      items: get().items.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    }),
  decrementItem: (itemId) =>
    set({
      items: get().items
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    }),
  clearCart: () => set({ items: [] }),
  getItemQuantity: (itemId) => get().items.find((item) => item.id === itemId)?.quantity ?? 0,
}));

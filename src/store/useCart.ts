import { create } from 'zustand';
import { Game } from '@prisma/client';

interface CartItem extends Game {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (game: Game) => void;
  removeItem: (gameId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  
  addItem: (game) => set((state) => {
    const existingItem = state.items.find((item) => item.id === game.id);
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { items: [...state.items, { ...game, quantity: 1 }] };
  }),
  
  removeItem: (gameId) => set((state) => ({
    items: state.items.filter((item) => item.id !== gameId)
  })),
  
  clearCart: () => set({ items: [] }),
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  
  setIsOpen: (isOpen) => set({ isOpen }),
  
  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}));

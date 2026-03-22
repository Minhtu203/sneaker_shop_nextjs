import { ICart } from '@/types/cart';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  cartItems: ICart[];
  setCartItems: (items: ICart[]) => void;
  addLocal: (newItem: ICart) => void;
  removeLocal: (data: { productId: string; color: string; size: number }) => void;
  updateQtyLocal: (productId: string, color: string, size: number, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartItems: [],

      setCartItems: (items) => set({ cartItems: items }),

      addLocal: (newItem) =>
        set((state) => {
          const isExisted = state.cartItems.find(
            (item) =>
              item.productId._id === newItem.productId._id &&
              item.color.colorName === newItem.color.colorName &&
              item.size === newItem.size
          );

          if (isExisted) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.productId._id === newItem.productId._id &&
                item.color.colorName === newItem.color.colorName &&
                item.size === newItem.size
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }
          return { cartItems: [...state.cartItems, newItem] };
        }),

      removeLocal: (data) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (x) => !(x.productId._id === data.productId && x.color.colorName === data.color && x.size === data.size)
          ),
        })),

      updateQtyLocal: (productId, color, size, qty) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.productId._id === productId && item.color.colorName === color && item.size === size
              ? { ...item, quantity: Math.max(1, qty) }
              : item
          ),
        })),

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'sneaker-cart-storage',
    }
  )
);

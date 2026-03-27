import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      // 🛒 STATE
      cart: [],
      isCartOpen: false,

      // 🔥 UI CONTROLS
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      // 🛒 ADD TO CART
      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isCartOpen: true,
          });
        } else {
          set({
            cart: [...cart, { ...product, quantity: 1 }],
            isCartOpen: true,
          });
        }
      },

      // ❌ REMOVE ITEM
      removeFromCart: (id) => {
        set({
          cart: get().cart.filter((item) => item.id !== id),
        });
      },

      // ➕ INCREASE QTY
      increaseQty: (id) => {
        set({
          cart: get().cart.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },

      // ➖ DECREASE QTY
      decreaseQty: (id) => {
        set({
          cart: get().cart
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        });
      },

      // 🧹 CLEAR CART (IMPORTANT FIX)
      clearCart: () => {
        set({
          cart: [],
          isCartOpen: false, // optional UX improvement
        });
      },

      // 📊 TOTAL ITEMS
      totalItems: () => {
        return get().cart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      },

      // 💰 TOTAL PRICE
      totalPrice: () => {
        return get().cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
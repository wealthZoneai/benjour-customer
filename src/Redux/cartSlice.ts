import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  discount: number;

  unitType: string | null;   // FIXED
  minValue: number | null;   // FIXED
  maxValue: number | null;   // FIXED
  // stepValue: number | null;  // FIXED
}


interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // ✅ Replace entire cart from backend
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    // ✅ Add single item (local add-to-cart)
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const payload = action.payload;

      const existing = state.items.find((i) => i.id === payload.id);

      if (existing) {
        existing.quantity += payload.quantity || 1;
      } else {
        state.items.push({
          id: payload.id,
          name: payload.name,
          price: payload.price,
          image: payload.image,

          // ADD THIS ↓↓↓
          discount: payload.discount ?? 0,

          // Dynamic unit values
          unitType: payload.unitType ?? null,
          minValue: payload.minValue ?? 1,
          maxValue: payload.maxValue ?? 50,

          // quantity
          quantity: payload.quantity || payload.minValue || 1,
        });
      }
    },



    // ❌ Remove one item
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    // ❌ Empty cart
    clearCart: (state) => {
      state.items = [];
    },

    // ❌ Update quantity to new value
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },

    // ➕ Increase quantity (dynamic step)
    increaseQuantity: (
      state,
      action: PayloadAction<{ id: number; amount: number }>
    ) => {
      const { id, amount } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity = item.quantity + amount;
      }
    },

    decreaseQuantity: (
      state,
      action: PayloadAction<{ id: number; amount: number; min: number }>
    ) => {
      const { id, amount, min } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (!item) return;

      const newQty = item.quantity - amount;

      // Remove only when newQty < min (strictly less)
      if (newQty < min) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        item.quantity = newQty;
      }
    },


  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;

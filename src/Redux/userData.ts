import { createSlice, type PayloadAction,  } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  role: string | null;
  userName?: string | null;
}

const initialState: UserState = {
  token: localStorage.getItem("token") || null,   
  role: localStorage.getItem("role") || null,
  userName: localStorage.getItem("userName") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Save token & merchantId
    setUserData: (state, action: PayloadAction<{ token: string; role: string,userName:string }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.userName = action.payload.userName || null;

      // Optional: persist in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("userName", action.payload.userName || "");
    },

    // ✅ Clear user data on logout
    clearUserData: (state) => {
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("merchantId");
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;

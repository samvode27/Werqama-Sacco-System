import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    currentUser: null, 
    token: null,
    isFetching: false,
    error: null,
  },

  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.token = action.payload.token;
      state.currentUser = {
        ...action.payload.user,
        membershipStatus: action.payload.user.membershipStatus || "unknown", // ✅ always present
      };
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isFetching = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlice.actions;
export default userSlice.reducer;

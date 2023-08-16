import { createSlice } from "@reduxjs/toolkit";

const name = JSON.parse(localStorage.getItem("name"));

const initialState = {
  isLoggedIn: false,
  name: name ? name : "",
  admin: {
    name: "",
    email: "",
  },
};

const authAdminSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_ADMIN(state, action) {
      const profile = action.payload;
      state.admin.name = profile.name;
      state.admin.email = profile.email;
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_ADMIN } = authAdminSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectAdmin = (state) => state.auth.admin;

export default authAdminSlice.reducer;

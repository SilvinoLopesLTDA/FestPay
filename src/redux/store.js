import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import authAdminReducer from "../redux/features/Admin/Auth/AuthAdminSlice";
import AdminReducer from "../redux/features/Admin/Actions/AdminSlice";
import clientReducer from "../redux/features/client/clientSlice";
import shopReducer from "../redux/features/shop/shopSlice";
import itemReducer from "./features/shop/itemSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authAdmin: authAdminReducer,
    admin: AdminReducer,
    client: clientReducer,
    shop: shopReducer,
    item: itemReducer,
  },
});
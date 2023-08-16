import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import authAdminReducer from "../redux/features/Admin/Auth/AuthAdminSlice";
import adminReducer from "../redux/features/Admin/Actions/AdminSlice";
import workerReducer from "../redux/features/Worker/Actions/workerSlice";
import clientReducer from "../redux/features/client/clientSlice";
import shopReducer from "../redux/features/shop/shopSlice";
import itemReducer from "./features/shop/itemSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authAdmin: authAdminReducer,
    admin: adminReducer,
    worker: workerReducer,
    client: clientReducer,
    shop: shopReducer,
    item: itemReducer,
  },
});
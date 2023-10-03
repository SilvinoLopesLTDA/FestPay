import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import clientReducer from "../redux/features/client/clientSlice";
import shopReducer from "../redux/features/shop/shopSlice";
import itemReducer from "./features/shop/itemSlice";
import itemsReducer from "./features/items/itemsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    shop: shopReducer,
    item: itemReducer,
    items: itemsReducer,
  },
});

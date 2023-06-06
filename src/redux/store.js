import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "../redux/features/client/clientSlice";
import shopReducer from "../redux/features/shop/shopSlice";

export const store = configureStore({
  reducer: {
    client: clientReducer,
    shop: shopReducer,
  },
});
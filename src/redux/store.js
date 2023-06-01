import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "../redux/features/clientSlice";

export const store = configureStore({
  reducer: {
    client: clientReducer,
  },
});
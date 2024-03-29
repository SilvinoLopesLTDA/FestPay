import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import shopService from "./shopService";
import { toast } from "react-toastify";

const initialState = {
  shops: null,
  shop: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create New Shop
export const createShop = createAsyncThunk(
  "shops/create",
  async (formData, thunkAPI) => {
    try {
      return await shopService.createShop(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all Shops
export const getShops = createAsyncThunk(
  "shops/getAll",
  async (_, thunkAPI) => {
    try {
      return await shopService.getShops();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a Shop
export const deleteShop = createAsyncThunk(
  "shops/delete",
  async (id, thunkAPI) => {
    try {
      return await shopService.deleteShop(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get a Shop
export const getShop = createAsyncThunk(
  "shops/getShop",
  async (id, thunkAPI) => {
    try {
      return await shopService.getShop(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Shop
export const updateShop = createAsyncThunk(
  "shops/updateShop",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await shopService.updateShop(id, formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Purchase QR Code
export const purchaseQRCode = createAsyncThunk(
  "qrCode/purchase",
  async (formData, thunkAPI) => {
    try {
      return await shopService.purchaseQRCode(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register a Purchase
export const registerPurchase = createAsyncThunk(
  "shops/purchase",
  async ({ id, cart }, thunkAPI) => {
    try {
      return await shopService.registerPurchase(id, cart);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all Purchases
export const getPurchases = createAsyncThunk(
  "shops/getAllPurchases",
  async (_, thunkAPI) => {
    try {
      return await shopService.getPurchases();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const shopSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createShop.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.shop.push(action.payload);
        toast.success("Ponto de venda Adicionado com Sucesso!");
      })
      .addCase(createShop.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getShops.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.shop = action.payload;
      })
      .addCase(getShops.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(deleteShop.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteShop.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Ponto de venda deletado com sucesso!");
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getShop.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.shop = action.payload;
      })
      .addCase(getShop.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(updateShop.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateShop.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Ponto de venda Atualizado com sucesso!");
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(purchaseQRCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(purchaseQRCode.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Compra realizada com sucesso!");
      })
      .addCase(purchaseQRCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(registerPurchase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerPurchase.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(registerPurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getPurchases.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPurchases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.purchases = action.payload;
      })
      .addCase(getPurchases.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const selectIsLoading = (state) => state.shop.isLoading;
export const selectShop = (state) => state.shop.shop;

export default shopSlice.reducer;

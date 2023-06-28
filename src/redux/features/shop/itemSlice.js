import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import shopService from "./shopService";
import { toast } from "react-toastify";

const initialState = {
  items: null,
  item: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create New Item
export const createItem = createAsyncThunk(
  "item/create",
  async (formData, thunkAPI) => {
    try {
      return await shopService.createItem(formData);
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

// Get all Items
export const getItems = createAsyncThunk("item/getAll", async (_, thunkAPI) => {
  try {
    return await shopService.getShops();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete a Item
export const deleteItem = createAsyncThunk(
  "item/delete",
  async (id, thunkAPI) => {
    try {
      return await shopService.deleteItem(id);
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

// Get a Item
export const getItem = createAsyncThunk(
  "item/getItem",
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

// Update Item
export const updateItem = createAsyncThunk(
  "item/updateItem",
  async ({ shopId, itemId, formData }, thunkAPI) => {
    try {
      return await shopService.updateItem(shopId, itemId, formData);
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

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.item.push(action.payload);
        toast.success("Item Adicionado com Sucesso!");
      })
      .addCase(createItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.item = action.payload;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteItem.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Item deletado com sucesso!");
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.item = action.payload;
      })
      .addCase(getItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(updateItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateItem.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        // toast.success("Item Atualizado com sucesso!");
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

// export const {  } = itemSlice.actions;

export const selectIsLoading = (state) => state.item.isLoading;
export const selectItem = (state) => state.item.item;

export default itemSlice.reducer;

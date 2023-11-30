import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import itemsService from "./itemsService";
import { toast } from "react-toastify";

const initialState = {
  items: null,
  item: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createItem = createAsyncThunk(
  "items/create",
  async (formData, thunkAPI) => {
    try {
      return await itemsService.createItem(formData);
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

export const getItems = createAsyncThunk(
  "items/getAll",
  async (_, thunkAPI) => {
    try {
      return await itemsService.getItems();
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

export const deleteItem = createAsyncThunk(
  "items/delete",
  async (id, thunkAPI) => {
    try {
      return await itemsService.deleteItem(id);
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

export const getItem = createAsyncThunk(
  "items/getItem",
  async (id, thunkAPI) => {
    try {
      return await itemsService.getItem(id);
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

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await itemsService.updateItem(id, formData);
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

export const placeItemInShop = createAsyncThunk(
  "items/placeItemInShop",
  async ({ shopId, formData }, thunkAPI) => {
    try {
      return await itemsService.placeItemInShop(shopId, formData);
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

export const handleUserChoice = createAsyncThunk(
  "items/handleUserChoice",
  async ({ id, selectedItemIndex }, thunkAPI) => {
    try {
      const response = await itemsService.handleUserChoice({
        id,
        selectedItemIndex,
      });
      return response;
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

export const removeItemFromShop = createAsyncThunk(
  "items/removeItemsFromShop",
  async ({ id, itemId }, thunkAPI) => {
    try {
      const response = await itemsService.removeItemFromShop(id, itemId);
      return response;
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

const itemsSlice = createSlice({
  name: "items",
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
        toast.success("Item adicionado com sucesso!");
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
        toast.success("Item atualizado com sucesso!");
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(placeItemInShop.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeItemInShop.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(placeItemInShop.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(handleUserChoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleUserChoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.item.push(action.payload);
        toast.success("Item alocado na barraca com sucesso!");
      })
      .addCase(handleUserChoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(removeItemFromShop.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeItemFromShop.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Item removido da barraca com sucesso!");
      })
      .addCase(removeItemFromShop.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const selectIsLoading = (state) => state.items.isLoading;
export const selectItems = (state) => state.items.item;

export default itemsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clientService from "./clientSevice";
import { toast } from "react-toastify";

const initialState = {
  clients: null,
  client: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create New Client
export const createClient = createAsyncThunk(
  "clients/create",
  async (formData, thunkAPI) => {
    try {
      return await clientService.createClient(formData);
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

// // Get all Products
// export const getProducts = createAsyncThunk(
//   "products/getAll",
//   async (_, thunkAPI) => {
//     try {
//       return await productService.getProducts();
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Delete a Product
// export const deleteProduct = createAsyncThunk(
//   "products/delete",
//   async (id, thunkAPI) => {
//     try {
//       return await productService.deleteProduct(id);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Get a Product
// export const getProduct = createAsyncThunk(
//   "products/getProduct",
//   async (id, thunkAPI) => {
//     try {
//       return await productService.getProduct(id);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// Update Client
export const updateClient = createAsyncThunk(
  "clients/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await clientService.updateClient(id, formData);
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

const clientSlice = createSlice({
  name: "client",
  initialState,
//   reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.client.push(action.payload);
        toast.success("Client Adicionado com Sucesso!");
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

    //   .addCase(getProducts.pending, (state) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(getProducts.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.isSuccess = true;
    //     state.isError = false;
    //     state.product = action.payload;
    //   })
    //   .addCase(getProducts.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.isError = true;
    //     state.message = action.payload;
    //     toast.error(action.payload);
    //   })

    //   .addCase(deleteProduct.pending, (state) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(deleteProduct.fulfilled, (state) => {
    //     state.isLoading = false;
    //     state.isSuccess = true;
    //     state.isError = false;
    //     toast.success("Produto deletado com sucesso!");
    //   })
    //   .addCase(deleteProduct.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.isError = true;
    //     state.message = action.payload;
    //     toast.error(action.payload);
    //   })

    //   .addCase(getProduct.pending, (state) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(getProduct.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.isSuccess = true;
    //     state.isError = false;
    //     state.product = action.payload;
    //   })
    //   .addCase(getProduct.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.isError = true;
    //     state.message = action.payload;
    //     toast.error(action.payload);
    //   })

      .addCase(updateClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateClient.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Produto Atualizado com sucesso!");
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

// export const {  } = clientSlice.actions;

export const selectIsLoading = (state) => state.client.isLoading;
export const selectClient = (state) => state.client.client;

export default clientSlice.reducer;
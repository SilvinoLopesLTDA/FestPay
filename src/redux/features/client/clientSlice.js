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

// Get all Clients
export const getClients = createAsyncThunk(
  "clients/getAll",
  async (_, thunkAPI) => {
    try {
      return await clientService.getClients();
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

// Delete a Client
export const deleteClient = createAsyncThunk(
  "clients/delete",
  async (id, thunkAPI) => {
    try {
      return await clientService.deleteClient(id);
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

// Get a CLient
export const getClient = createAsyncThunk(
  "clients/getClient",
  async (id, thunkAPI) => {
    try {
      return await clientService.getClient(id);
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

// Update Client
export const updateClient = createAsyncThunk(
  "clients/updateClient",
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
        toast.success("Cliente Adicionado com Sucesso!");
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getClients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.client = action.payload;
      })
      .addCase(getClients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteClient.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Cliente deletado com sucesso!");
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.client = action.payload;
      })
      .addCase(getClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(updateClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateClient.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Cliente Atualizado com sucesso!");
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
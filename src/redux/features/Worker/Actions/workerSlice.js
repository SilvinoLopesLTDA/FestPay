import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import workerService from "./workerService";
import { toast } from "react-toastify";

const initialState = {
  workers: null,
  worker: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Register Worker
export const registerWorker = createAsyncThunk(
  "workers/create",
  async (formData, thunkAPI) => {
    try {
      return await workerService.registerWorker(formData);
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

// Get all Workers
export const getWorkers = createAsyncThunk(
  "workers/getAll",
  async (_, thunkAPI) => {
    try {
      return await workerService.getWorkers();
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

// Get a Worker
export const getWorker = createAsyncThunk(
  "workers/getWorker",
  async (id, thunkAPI) => {
    try {
      return await workerService.getWorker(id);
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

// Delete a Worker
export const deleteWorker = createAsyncThunk(
  "workers/delete",
  async (id, thunkAPI) => {
    try {
      return await workerService.deleteWorker(id);
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

// Update Worker
export const updateWorker = createAsyncThunk(
  "workers/updateWorker",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await workerService.updateWorker(id, formData);
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

const workerSlice = createSlice({
  name: "workers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerWorker.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerWorker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.worker.push(action.payload);
        toast.success("Operário Adicionado com Sucesso!");
      })
      .addCase(registerWorker.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getWorkers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.worker = action.payload;
      })
      .addCase(getWorkers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(deleteWorker.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWorker.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Operário deletado com sucesso!");
      })
      .addCase(deleteWorker.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getWorker.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.worker = action.payload;
      })
      .addCase(getWorker.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(updateWorker.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWorker.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Operário Atualizado com sucesso!");
      })
      .addCase(updateWorker.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const selectIsLoadingWorker = (state) => state.worker.isLoading;
export const selectWorker = (state) => state.worker.worker;

export default workerSlice.reducer;

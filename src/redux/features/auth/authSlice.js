import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteSubaccount,
  listSubaccounts,
  getSubaccountById,
  registerSubUser,
  updateSubaccount,
  getUser,
} from "./authService.js";
import { toast } from "react-toastify";

const name = JSON.parse(localStorage.getItem("name"));

const initialState = {
  isLoggedIn: false,
  name: name ? name : "",
  user: null,
  subaccount: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const registerSubaccount = createAsyncThunk(
  "user/createSubaccount",
  async (formData, thunkAPI) => {
    try {
      return await registerSubUser(formData);
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

export const getUserAccount = createAsyncThunk(
  "user/getUser",
  async (_, thunkAPI) => {
    try {
      return await getUser();
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

export const getSubaccounts = createAsyncThunk(
  "user/getSubaccounts",
  async (_, thunkAPI) => {
    try {
      return await listSubaccounts();
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

export const getSubaccount = createAsyncThunk(
  "user/getSubaccount",
  async (id, thunkAPI) => {
    try {
      return await getSubaccountById(id);
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

export const updateSubaccounts = createAsyncThunk(
  "user/updateSubaccount",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await updateSubaccount(id, formData);
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

export const deleteSubaccounts = createAsyncThunk(
  "user/deleteSubaccount",
  async (id, thunkAPI) => {
    try {
      return await deleteSubaccount(id);
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_USER(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerSubaccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerSubaccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.subaccount.push(action.payload);
        state.user.subaccounts.push(action.payload);
        toast.success("Subconta criada com sucesso!");
      })
      .addCase(registerSubaccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getUserAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(getUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getSubaccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubaccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.subaccount = action.payload;
      })
      .addCase(getSubaccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getSubaccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubaccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.subaccount = action.payload;
      })
      .addCase(getSubaccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateSubaccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubaccounts.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Subconta atualizada com sucesso!");
      })
      .addCase(updateSubaccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteSubaccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubaccounts.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Subconta deletada com sucesso!");
      })
      .addCase(deleteSubaccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;
export const selectSubaccounts = (state) => state.auth.user.subaccounts;
export const selectSubaccount = (state) => state.auth.subaccount;
export const selectIsLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../services/interceptor";

interface LoginPayload {
    email: string;
    password: string;
  }
  
  interface AuthUser {
    id: string;
    name: string;
    email: string;
  }
  
  interface AuthState {
    token: string | null;
    loading: boolean;
    error: string | null;
    authUser: AuthUser | null;
  }


const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  authUser: null,
};

export const login = createAsyncThunk<
  { token: string; user: AuthUser },
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (credentials: LoginPayload, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BASE_URL}/login`,
      credentials
    );
    return response?.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        return rejectWithValue(error?.response?.data?.message || "Login failed. Please try again.");
      }
  }
});

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
      try {
        await axiosInstance.get('/logout'); 
        localStorage.removeItem('authUser'); 
      } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to log out');
          }
      }
    }
  );

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action) => {
          state.loading = false;
          localStorage.setItem("authUser", JSON.stringify(action?.payload)); 
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<string| undefined>) => {
        state.loading = false;
        state.error = action.payload || "An error occurred" ;
      })

    //   logout 
      .addCase(logout.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state)=>{
        state.loading = false;
        state.error = null;
        localStorage.removeItem("authUser")
      })
      .addCase(logout.rejected, (state)=>{
        state.loading = false;
        state.error = "An error occurred" ;
      })


  },
});


export default authSlice.reducer;

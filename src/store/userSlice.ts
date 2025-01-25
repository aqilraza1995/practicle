import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../services/interceptor";
import axios from "axios";
import { saveAs } from "file-saver";

interface User {
  [key: string]: unknown;
}
interface Role {
  name: string;
  id: string;
}

interface UserList {
  password: string;
  gender: number;
  status: number;
  profile: null;
  user_galleries: never[];
  user_pictures: never[];
  status_text: string;
  gender_text: string;
  dob: string ;
  role: Role;
  email: string;
  name: string;
  data: User[];
  total: number;
}

interface RoleList {
  guard_name?: string;
  id?: string;
  landing_page?: string;
  name?: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  list?: UserList | null;
  selectedUser?: UserList | null;
  roles?: RoleList
}

const initialState: AuthState = {
  loading: false,
  error: null,
  list: null,
  selectedUser: null,
};

interface FetchUsersParams {
  page?: number;
  per_page?: number;
  sort?: string;
  order?: string;
  search?: string;
}

interface RoleParams {
  page?: number;
  per_page?: number;
  [key: string]: unknown;
}


interface UserPayload {
  name: string;
  email: string;
  role_id: number;
  dob: string; 
  profile: File[]; 
  gender: number;
  status: number;
  galleries: File[]; 
  pictures: File[];
  password: string;
}

export const getUsers = createAsyncThunk<
  UserList,
  FetchUsersParams,
  { rejectValue: string }
>("users/fetch", async (params: FetchUsersParams, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/users", { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch users"
      );
    }
    return rejectWithValue("Unknown error occurred");
  }
});

export const getUsersById = createAsyncThunk<
  UserList,
  number,
  { rejectValue: string }
>("users/fetch-user-by-id", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch users"
      );
    }
    return rejectWithValue("Unknown error occurred");
  }
});

export const exportUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "users/export-users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users-export", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, "users_export.csv");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error?.response?.data?.message || "Failed to fetch users"
        );
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const multiDelete = createAsyncThunk<
  void,
  number[],
  { rejectValue: string }
>("users/users-delete-multiple", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/users-delete-multiple", { id });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch users"
      );
    }
    return rejectWithValue("Unknown error occurred");
  }
});

export const getRoles = createAsyncThunk<
  RoleList,
  RoleParams,
  { rejectValue: string }
>("get-roles", async (params: RoleParams, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/roles", { params });
    console.log("response :", response?.data?.data);
    return response.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch users"
      );
    }
    return rejectWithValue("Unknown error occurred");
  }
});


export const deleteUser = createAsyncThunk<  void, number | string, { rejectValue: string }>("users/delete-user", async (id, { rejectWithValue }) => {
  try {
    console.log("id :", id)
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete users"
      );
    }
    return rejectWithValue("Unknown error occurred");
  }
});


export const addUser = createAsyncThunk(
  "user/addUser",
  async (userPayload: UserPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", userPayload.name);
      formData.append("email", userPayload.email);
      formData.append("role_id", userPayload.role_id.toString());
      formData.append("dob", userPayload.dob);
      formData.append("gender", userPayload.gender.toString());
      formData.append("status", userPayload.status.toString());

      if (userPayload.profile && userPayload.profile[0]) {
        formData.append("profile",userPayload.profile[0]); 
      }

      if (userPayload.galleries) {
        userPayload?.galleries?.forEach((file) => {
          formData.append(`user_galleries[]`, file);
        });
      }

      if (userPayload.pictures) {
        userPayload?.pictures?.forEach((file: string | Blob) => {
          formData.append(`user_pictures[]`, file);
        });
      }

      formData.append("password", userPayload.password);

      const response = await axiosInstance.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error?.response?.data?.message || "Failed to fetch users"
        );
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userPayload, id }: { userPayload: UserPayload, id: number }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", userPayload.name);
      formData.append("email", userPayload.email);
      formData.append("role_id", userPayload.role_id.toString());
      formData.append("dob", userPayload.dob);
      formData.append("gender", userPayload.gender.toString());
      formData.append("status", userPayload.status.toString());

      if (userPayload.profile && userPayload.profile[0] && typeof userPayload.profile !== "string") {
        formData.append("profile",userPayload.profile[0]); 
      }

      if (userPayload.galleries?.length) {
        userPayload.galleries.forEach((item) => {
          if (!("gallery" in item)) {
            formData.append("user_galleries[]", item);
          }
        });
      }

      if (userPayload.pictures?.length) {
        userPayload.pictures.forEach((item) => {
          if (!("picture" in item)) {
            formData.append("user_pictures[]", item);
          }
        });
      }

      const response = await axiosInstance.post(`/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error?.response?.data?.message || "Failed to fetch users"
        );
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);



const authSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    removeUser: (state, action: PayloadAction<number>) => {
      if (state.list?.data) { 
        state.list.data = state.list.data.filter(user => Number(user.id) !== action.payload); 
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<UserList>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(
        getUsers.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "An error occurred";
        }
      )
      //multiple delete
      .addCase(multiDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(multiDelete.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(
        multiDelete.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "An error occurred";
        }
      )
      // get user by id
      .addCase(getUsersById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUsersById.fulfilled,
        (state, action: PayloadAction<UserList>) => {
          state.loading = false;
          state.selectedUser = action.payload;
        }
      )
      .addCase(
        getUsersById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "An error occurred";
        }
      )
    //   get Roles
    .addCase(getRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoles.fulfilled, (state, action: PayloadAction<RoleList>) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(
        getRoles.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "An error occurred";
        }
      )
  },
});

export const { removeUser } = authSlice.actions;

export default authSlice.reducer;

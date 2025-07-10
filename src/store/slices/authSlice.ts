import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  googleId: string;
  email: string;
  email_verified: Boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  token: string;
  phoneNumber?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    createUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { createUser, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;

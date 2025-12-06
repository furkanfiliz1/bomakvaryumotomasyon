import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LoginRequestModel } from '@store';
import { User } from '@types';

export interface IAuthState {
  user: User | undefined;
  token: string;
  permissions: Array<unknown>;
  registeredUser?: LoginRequestModel;
  accessToken?: string;
}

export const initialState: IAuthState = {
  token: '',
  user: undefined,
  permissions: [],
  registeredUser: {},
  accessToken: undefined,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.accessToken = '';
      state.token = '';
      state.user = undefined;
    },
    setUser: (state, action: PayloadAction<User>) => {
      const user: User = { ...state.user, ...action.payload };
      state.user = user;
    },
    resetPermissions: (state) => {
      state.permissions = [];
    },
    setRegisteredUserForm: (state, action) => {
      state.registeredUser = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

const { actions, reducer } = authSlice;
export const { login, logout, setUser, resetPermissions, setRegisteredUserForm, setAccessToken } = actions;

export default reducer;

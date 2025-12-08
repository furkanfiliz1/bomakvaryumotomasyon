import {  createSlice } from '@reduxjs/toolkit';

export interface IAuthState {
  token: string;
  permissions: Array<unknown>;
  accessToken?: string;
  user?: {
    userName: string;
    email?: string;
  };
}

export const initialState: IAuthState = {
  token: '',
  permissions: [],
  accessToken: undefined,
  user: undefined,
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
         state.token = '';
         state.user = undefined;

    },
 
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

const { actions, reducer } = authSlice;
export const { login, logout,  setAccessToken } = actions;

export default reducer;

import {  createSlice } from '@reduxjs/toolkit';

export interface IAuthState {
  token: string;
  permissions: Array<unknown>;
  accessToken?: string;
}

export const initialState: IAuthState = {
  token: '',
  permissions: [],
  accessToken: undefined,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
    },
    logout: () => {
      
    },
 
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

const { actions, reducer } = authSlice;
export const { login, logout,  setAccessToken } = actions;

export default reducer;

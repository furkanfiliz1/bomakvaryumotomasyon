import { createSlice } from '@reduxjs/toolkit';

export type AppLanguage = 'tr' | 'en';

interface ISettingsState {
  language: AppLanguage;
}

const initialState: ISettingsState = {
  language: 'tr',
};

const settingsSlice = createSlice({
  name: 'settingsSlice',
  initialState,
  reducers: {
    changeLanguage: (state, action: { payload: AppLanguage }) => {
      state.language = action.payload;
    },
  },
});

const { actions, reducer } = settingsSlice;
export const { changeLanguage } = actions;

export default reducer;

import { createSlice } from '@reduxjs/toolkit';
import { INavConfig } from '@types';
import { cloneDeep } from 'lodash';

export type BreadcrumbModel = {
  activeCrumb: INavConfig;
  stack: INavConfig[];
};

export const initialBcState: BreadcrumbModel = {
  activeCrumb: {
    path: '',
    title: '',
    breadcrumbTitle: '',
  },
  stack: [],
};

const breadcrumbSlice = createSlice({
  name: 'breadcrumbSlice',
  initialState: initialBcState,
  reducers: {
    setActiveBreadcrumb: (state, action: { payload: INavConfig }) => {
      state.activeCrumb = action.payload;
    },
    setBreadcrumbStack: (state, action: { payload: INavConfig[] }) => {
      state.stack = action.payload;
    },
    clear(state) {
      state = cloneDeep(initialBcState);
      return state;
    },
  },
});

const { actions, reducer } = breadcrumbSlice;
export const { setActiveBreadcrumb, setBreadcrumbStack, clear } = actions;

export default reducer;

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { setupListeners } from '@reduxjs/toolkit/dist/query';

import * as announcementsRedux from './slices/announcements';
import * as authRedux from './slices/auth';
import * as breadcrumbsRedux from './slices/breadcrumbs';
import * as settingsRedux from './slices/settings';
import * as systemRulesRedux from './slices/systemRules';

import { analysisApi } from 'src/api/analysisApi';
import { invoiceOperationApi } from 'src/api/invoiceOperationApi';
import { baseApi } from '../api/baseApi';
import { rtkQueryErrorHandler } from '../api/error-handler';
import { figoParaApi } from '../api/figoParaApi';

export * from '../api/figoParaApi';
export { announcementsRedux, authRedux, breadcrumbsRedux, settingsRedux, systemRulesRedux };

export const rootReducer = combineReducers({
  auth: persistReducer({ key: 'auth', version: 1, storage }, authRedux.default),
  breadcrumbs: breadcrumbsRedux.default,
  settings: persistReducer({ key: 'settings', version: 1, storage }, settingsRedux.default),
  announcements: persistReducer({ key: 'announcements', version: 1, storage }, announcementsRedux.default),
  systemRule: persistReducer({ key: 'systemRulesRedux', version: 1, storage }, systemRulesRedux.default),
  [baseApi.reducerPath]: baseApi.reducer,
  [invoiceOperationApi.reducerPath]: invoiceOperationApi.reducer,
  [analysisApi.reducerPath]: analysisApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([
      baseApi.middleware,
      figoParaApi.middleware,
      invoiceOperationApi.middleware,
      analysisApi.middleware,
      rtkQueryErrorHandler,
    ]),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

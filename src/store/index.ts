import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { setupListeners } from '@reduxjs/toolkit/dist/query';

import * as authRedux from './slices/auth';
import * as breadcrumbsRedux from './slices/breadcrumbs';

import { rtkQueryErrorHandler } from '../api/error-handler';

export {  authRedux, breadcrumbsRedux };

export const rootReducer = combineReducers({
  auth: persistReducer({ key: 'auth', version: 1, storage }, authRedux.default),
  breadcrumbs: breadcrumbsRedux.default,

});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([
   
      rtkQueryErrorHandler,
    ]),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

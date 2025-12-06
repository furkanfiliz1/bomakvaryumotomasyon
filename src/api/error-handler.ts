import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { authRedux, RootState } from '@store';

//import * as RootNavigation from '@/navigation/RootNavigation';
//import Routes from '@/navigation/Routes';
//import {authRedux} from '@/store';

/**
 * Network error type definition
 */
type NetworkErrorPayload = {
  status?: string | number;
  error?: string | Error;
  name?: string;
  message?: string;
  meta?: {
    baseQueryMeta?: {
      request?: unknown;
      response?: unknown;
    };
  };
};

/**
 * Check if the error is a network error that indicates VPN disconnection
 * @param error The error object to check
 * @returns boolean indicating if it's a network connectivity error
 */
const isNetworkError = (error: NetworkErrorPayload): boolean => {
  // Check for fetch/network errors
  if (error?.name === 'TypeError' && error?.message) {
    const message = error.message.toLowerCase();
    return (
      message.includes('failed to fetch') ||
      message.includes('network error') ||
      message.includes('err_name_not_resolved') ||
      message.includes('err_internet_disconnected') ||
      message.includes('err_network_changed')
    );
  }

  // Check for status-based network errors
  if (error?.status === 'FETCH_ERROR') {
    return true;
  }

  // Check for error messages in the error object
  if (error?.error && typeof error.error === 'string') {
    const errorString = error.error.toLowerCase();
    return (
      errorString.includes('err_name_not_resolved') ||
      errorString.includes('failed to fetch') ||
      errorString.includes('network error')
    );
  }

  // Check for fetch errors in action meta
  if (error?.meta?.baseQueryMeta?.request && error?.meta?.baseQueryMeta?.response === undefined) {
    return true;
  }

  return false;
};

export const rtkQueryErrorHandler: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (isRejectedWithValue(action)) {
      const state = getState() as RootState;
      const hasToken = state?.auth?.token;

      // Prevent multiple logout attempts
      if (!hasToken) {
        return next(action);
      }

      // Handle authentication errors
      if (action.payload.status === 401) {
        setTimeout(() => dispatch(authRedux.logout()), 100);
        // if (RootNavigation.navigationRef?.getCurrentRoute()?.name !== Routes.LOGIN_SCREEN) {
        //  RootNavigation.replace(Routes.AUTH_ROOT as never);
        // }
      }

      // Handle network errors (VPN disconnection)
      if (isNetworkError(action.payload)) {
        console.warn('Network error detected, logging out user:', action.payload);

        // Set a session storage flag to show network error message on login page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('networkErrorLogout', 'true');
        }

        // Delay logout to prevent race conditions
        setTimeout(() => dispatch(authRedux.logout()), 100);
      }
    } 
    return next(action);
  };

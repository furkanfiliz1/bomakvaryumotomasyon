import { useNotice } from '@components';
import { SerializedError } from '@reduxjs/toolkit';
import { ExceptionResponseModel } from '@store';
import { AllowanceErrorCodes, LoginErrorCodes } from '@types';
import { useEffect } from 'react';

type CustomError = {
  data: ExceptionResponseModel;
};

type ErrorType = CustomError | SerializedError | Error | undefined;

/**
 * Check if the error is a network error that indicates VPN disconnection
 * @param error The error object to check
 * @returns boolean indicating if it's a network connectivity error
 */
const isNetworkError = (error: ErrorType): boolean => {
  if (!error) return false;

  // Check for Error type with name and message
  if ('name' in error && 'message' in error && error.name === 'TypeError' && error.message) {
    const message = error.message.toLowerCase();
    return (
      message.includes('failed to fetch') ||
      message.includes('network error') ||
      message.includes('err_name_not_resolved') ||
      message.includes('err_internet_disconnected') ||
      message.includes('err_network_changed')
    );
  }

  // Check for SerializedError type with error string
  if ('error' in error && error.error && typeof error.error === 'string') {
    const errorString = error.error.toLowerCase();
    return (
      errorString.includes('err_name_not_resolved') ||
      errorString.includes('failed to fetch') ||
      errorString.includes('network error')
    );
  }

  return false;
};

/**
 *
 * @param subscribedErrors Error or list of error object
 * @returns void - subscribes to errors and displays error dialog when occur
 */
const useErrorListener = (subscribedErrors: ErrorType | ErrorType[]) => {
  const notice = useNotice();

  const error = Array.isArray(subscribedErrors) ? subscribedErrors.find((e) => e) : subscribedErrors;

  useEffect(() => {
    if (!error) {
      return;
    }

    if ('name' in error && error.name) {
      // these errors  are thrown by JS runtime
      if (error.name === 'AbortError') {
        return;
      }
    }

    // Check for network errors first (VPN disconnection)
    if (isNetworkError(error)) {
      // Don't show error notice if we're in the process of logging out due to network error
      // The RTK Query middleware will handle the logout, and the error message will be shown on login page
      console.warn('Network error detected, logout will be handled by middleware');
      return;
    }

    if ('data' in error && error.data) {
      if (
        ('Code' in error.data && error.data.Code === '401') ||
        ('Code' in error.data && error.data.Code === LoginErrorCodes.EmailNotVerified) ||
        ('Code' in error.data && error.data.Code === AllowanceErrorCodes.TimeoutAllowanceBlocked)
      ) {
        // 401'se dialog çıkarma logout ediyoruz zaten
        return;
      }

      notice({
        variant: 'error',
        title: error?.data?.Title,
        message: error?.data?.FriendlyMessage,
        buttonTitle: 'Tamam',
      });
    } else {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Bilinmeyen bir hata oluştu',
        buttonTitle: 'Tamam',
      });
    }
  }, [error, notice]);

  return null;
};

export default useErrorListener;

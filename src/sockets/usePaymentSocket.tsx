import { store } from '@store';
import { baseURL } from '@api';
import * as signalR from '@microsoft/signalr';
import { useCallback, useEffect, useMemo } from 'react';

export const usePaymentSocket = (orderNumber: string | undefined) => {
  const token = store.getState().auth.token;

  const socket = useMemo(() => {
    return (
      orderNumber &&
      new signalR.HubConnectionBuilder()
        .withUrl(`${baseURL}/hub/payment?Token=${token}&ReferenceId=${orderNumber}`)
        .build()
    );
  }, [orderNumber, token]);

  useEffect(() => {
    socket && socket.state === signalR.HubConnectionState.Disconnected && socket.start();

    return () => {
      socket && socket.off('PayResult');
    };
  }, [socket]);

  const onPaymentResult = useCallback(
    (cb: (data: { PayResult: unknown }) => void) => socket && socket.on('PayResult', cb),
    [socket],
  );

  return onPaymentResult;
};

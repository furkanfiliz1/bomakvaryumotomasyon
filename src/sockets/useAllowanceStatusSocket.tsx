import { store } from '@store';
import { baseURL } from '@api';
import * as signalR from '@microsoft/signalr';
import { useCallback, useEffect, useMemo } from 'react';

export const useAllowanceStatusSocket = (allowanceId: number) => {
  const token = store.getState().auth.token;

  const socket = useMemo(() => {
    return new signalR.HubConnectionBuilder()
      .withUrl(`${baseURL}/hub/allowance?Token=${token}&ReferenceId=${allowanceId}`)
      .build();
  }, [allowanceId, token]);

  useEffect(() => {
    socket && socket.state === signalR.HubConnectionState.Disconnected && socket.start();

    return () => {
      socket && socket.off('Status');
    };
  }, [socket]);

  const onStatusChange = useCallback((cb: () => void) => socket && socket.on('Status', cb), [socket]);

  return onStatusChange;
};

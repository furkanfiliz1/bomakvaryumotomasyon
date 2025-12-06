import { store } from '@store';
import { baseURL } from '@api';
import * as signalR from '@microsoft/signalr';
import { useCallback, useEffect, useMemo } from 'react';

export const useUserSessionSocket = (userId: number) => {
  const token = store.getState().auth.token;

  const socket = useMemo(() => {
    return new signalR.HubConnectionBuilder().withUrl(`${baseURL}/hub/user?Token=${token}&UserId=${userId}`).build();
  }, [userId, token]);

  useEffect(() => {
    socket && socket.state === signalR.HubConnectionState.Disconnected && socket.start();

    return () => {
      socket && socket.off('ForceLogoutUser');
    };
  }, [socket]);

  const onStatusChange = useCallback((cb: () => void) => socket && socket.on('ForceLogoutUser', cb), [socket]);

  return onStatusChange;
};

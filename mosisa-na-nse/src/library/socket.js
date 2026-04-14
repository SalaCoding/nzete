import { API_URL } from '../constants/api';
import { useAuthUserStore } from './authUserStore';
import { io } from 'socket.io-client';

// Always send the latest token when connecting
export const socket = io(API_URL, {
  transports: ['websocket'],
  auth: (cb) => {
    cb({ token: useAuthUserStore.getState().token });
  },
});

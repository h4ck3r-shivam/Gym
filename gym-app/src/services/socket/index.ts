import io, { Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../config';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(API_BASE_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Example event listeners
  onNotification(callback: (data: any) => void) {
    this.socket?.on('notification', callback);
  }

  onBookingUpdate(callback: (data: any) => void) {
    this.socket?.on('booking_update', callback);
  }

  // Add more specific event listeners as needed
}

export const socketService = new SocketService();

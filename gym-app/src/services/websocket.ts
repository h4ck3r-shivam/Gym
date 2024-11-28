import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

interface WebSocketMessage {
  type: string;
  payload: any;
}

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // Start with 1 second
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000/ws';
    this.ws = new WebSocket(`${wsUrl}?token=${token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.reconnectTimeout = 1000;
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.messageHandlers.forEach((handler) => handler(message));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(token);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      this.reconnectAttempts++;
      this.reconnectTimeout *= 2; // Exponential backoff
      this.connect(token);
    }, this.reconnectTimeout);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  addMessageHandler(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }
}

export function useWebSocket() {
  const { token } = useAuth();
  const { addNotification } = useNotification();
  const wsService = useRef(WebSocketService.getInstance());

  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      switch (message.type) {
        case 'CLASS_REMINDER':
          addNotification({
            type: 'info',
            message: `Reminder: Your class "${message.payload.className}" starts in ${message.payload.timeUntilStart}`,
          });
          break;

        case 'BOOKING_CONFIRMATION':
          addNotification({
            type: 'success',
            message: `Your booking for "${message.payload.className}" has been confirmed!`,
          });
          break;

        case 'BOOKING_CANCELLATION':
          addNotification({
            type: 'warning',
            message: `Your booking for "${message.payload.className}" has been cancelled.`,
          });
          break;

        case 'CLASS_CHANGE':
          addNotification({
            type: 'info',
            message: `There has been a change to your class "${message.payload.className}": ${message.payload.changeDescription}`,
          });
          break;

        case 'MEMBERSHIP_UPDATE':
          addNotification({
            type: 'info',
            message: `Your membership status has been updated: ${message.payload.message}`,
          });
          break;

        default:
          console.log('Unhandled message type:', message.type);
      }
    },
    [addNotification]
  );

  useEffect(() => {
    if (token) {
      wsService.current.connect(token);
      wsService.current.addMessageHandler(handleMessage);

      return () => {
        wsService.current.removeMessageHandler(handleMessage);
        wsService.current.disconnect();
      };
    }
  }, [token, handleMessage]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    wsService.current.send(message);
  }, []);

  return { sendMessage };
}

export default WebSocketService;

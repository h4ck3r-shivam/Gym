import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

export enum WebSocketEventType {
  NOTIFICATION = 'notification',
  BOOKING_UPDATE = 'booking_update',
  USER_STATUS = 'user_status',
  ERROR = 'error'
}

export interface WebSocketMessage<T = any> {
  type: WebSocketEventType;
  data: T;
  timestamp: number;
}

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private messageCallbacks: Map<WebSocketEventType, ((data: any) => void)[]> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(token: string): void {
    this.token = token;
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    
    try {
      this.socket = new WebSocket(`${wsUrl}?token=${token}`);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected', event);
        this.handleReconnection();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.handleReconnection();
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.dispatchMessage(message);
        } catch (parseError) {
          console.error('Error parsing WebSocket message:', parseError);
        }
      };
    } catch (connectionError) {
      console.error('WebSocket connection error:', connectionError);
      this.handleReconnection();
    }
  }

  private handleReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = Math.min(5000 * this.reconnectAttempts, 30000);
      
      setTimeout(() => {
        if (this.token) {
          console.log(`Attempting to reconnect (Attempt ${this.reconnectAttempts})`);
          this.connect(this.token);
        }
      }, timeout);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private dispatchMessage(message: WebSocketMessage): void {
    const callbacks = this.messageCallbacks.get(message.type) || [];
    callbacks.forEach(callback => callback(message.data));
  }

  public on<T = any>(
    eventType: WebSocketEventType, 
    callback: (data: T) => void
  ): () => void {
    const existingCallbacks = this.messageCallbacks.get(eventType) || [];
    existingCallbacks.push(callback);
    this.messageCallbacks.set(eventType, existingCallbacks);

    return () => {
      const updatedCallbacks = existingCallbacks.filter(cb => cb !== callback);
      this.messageCallbacks.set(eventType, updatedCallbacks);
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.token = null;
      this.reconnectAttempts = 0;
      this.messageCallbacks.clear();
    }
  }

  public sendMessage<T = any>(type: WebSocketEventType, data: T): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type,
        data,
        timestamp: Date.now()
      }));
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }
}

export function useWebSocket() {
  const { user, token } = useAuth();
  const { addNotification } = useNotification();
  const [isConnected, setIsConnected] = useState(false);
  const webSocketService = useRef(WebSocketService.getInstance());

  useEffect(() => {
    if (user && token) {
      webSocketService.current.connect(token);
      setIsConnected(true);

      const unsubscribeNotification = webSocketService.current.on(
        WebSocketEventType.NOTIFICATION, 
        (data: any) => {
          addNotification(data.message);
        }
      );

      return () => {
        unsubscribeNotification();
        webSocketService.current.disconnect();
        setIsConnected(false);
      };
    }
  }, [user, token, addNotification]);

  return { 
    isConnected, 
    sendMessage: webSocketService.current.sendMessage.bind(webSocketService.current),
    on: webSocketService.current.on.bind(webSocketService.current)
  };
}

export const webSocketService = WebSocketService.getInstance();

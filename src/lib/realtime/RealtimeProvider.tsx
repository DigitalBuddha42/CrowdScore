'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface RealtimeContextType {
  isConnected: boolean;
  subscribe: (channel: string, callback: (data: any) => void) => () => void;
  publish: (channel: string, data: any) => Promise<void>;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [subscribers, setSubscribers] = useState<Map<string, Set<(data: any) => void>>>(new Map());

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const baseDelay = 1000;

    const connect = () => {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        reconnectAttempts = 0;
        toast.success('Real-time connection established');
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
        toast.error('Real-time connection lost');

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempts), 30000);
          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++;
            connect();
          }, delay);
        } else {
          toast.error('Failed to establish real-time connection. Please refresh the page.');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        toast.error('Real-time connection error');
      };

      ws.onmessage = (event) => {
        try {
          const { channel, data } = JSON.parse(event.data);
          const channelSubscribers = subscribers.get(channel);
          if (channelSubscribers) {
            channelSubscribers.forEach((callback) => callback(data));
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [subscribers]);

  const subscribe = (channel: string, callback: (data: any) => void) => {
    setSubscribers((prev) => {
      const newSubscribers = new Map(prev);
      const channelSubscribers = newSubscribers.get(channel) || new Set();
      channelSubscribers.add(callback);
      newSubscribers.set(channel, channelSubscribers);
      return newSubscribers;
    });

    return () => {
      setSubscribers((prev) => {
        const newSubscribers = new Map(prev);
        const channelSubscribers = newSubscribers.get(channel);
        if (channelSubscribers) {
          channelSubscribers.delete(callback);
          if (channelSubscribers.size === 0) {
            newSubscribers.delete(channel);
          }
        }
        return newSubscribers;
      });
    };
  };

  const publish = async (channel: string, data: any) => {
    if (!isConnected) {
      throw new Error('Not connected to real-time server');
    }

    try {
      const response = await fetch('/api/realtime/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel, data }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish message');
      }
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }
  };

  return (
    <RealtimeContext.Provider value={{ isConnected, subscribe, publish }}>
      {children}
    </RealtimeContext.Provider>
  );
}; 
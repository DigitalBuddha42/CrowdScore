import { WebSocketServer, WebSocket } from 'ws';
import { redis, subscribe } from '@/lib/redis';
import { getServerAuthSession } from '@/lib/auth';

interface WebSocketClient extends WebSocket {
  isAlive: boolean;
  userId?: string;
}

export async function createWebSocketServer(server: any) {
  const wss = new WebSocketServer({ server });

  // Heartbeat interval to check connection health
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = ws as WebSocketClient;
      if (!client.isAlive) {
        return client.close();
      }
      client.isAlive = false;
      client.send('ping');
    });
  }, 30000);

  wss.on('connection', async (ws) => {
    const client = ws as WebSocketClient;
    client.isAlive = true;

    // Handle pong messages
    client.addEventListener('message', async (event) => {
      if (event.data === 'pong') {
        client.isAlive = true;
      } else {
        try {
          const data = JSON.parse(event.data.toString());
          if (data.type === 'auth') {
            const session = await getServerAuthSession();
            if (session?.user?.id) {
              client.userId = session.user.id;
              client.send(JSON.stringify({ type: 'auth', success: true }));
            } else {
              client.send(JSON.stringify({ type: 'auth', success: false }));
              client.close();
            }
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      }
    });

    // Handle client disconnection
    client.addEventListener('close', () => {
      client.isAlive = false;
    });
  });

  // Clean up on server shutdown
  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  // Set up Redis subscription for broadcasting messages
  const subscriber = await subscribe('broadcast', (message) => {
    wss.clients.forEach((ws) => {
      const client = ws as WebSocketClient;
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  return wss;
} 
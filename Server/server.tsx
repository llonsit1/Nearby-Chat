import { WebSocketServer } from 'ws';
import { networkInterfaces } from 'os';


type FileMetadata = {
    extension: string;
    name: string;
    size: number;
    uri: string;
    mime: string
};

type Message = {
    id: string;
    date: string;
    sender: boolean;
    text: string;
    incoming: boolean;
    fileMetadata?: FileMetadata;
};

const PORT = 3000;

const clients = new Set<WebSocket>();

function getLocalIpAddress() {
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const netInterface of interfaces[name]) {
      if (netInterface.family === 'IPv4' && !netInterface.internal) return netInterface.address;
    }
  }
  return '127.0.0.1';
}

const wss = new WebSocketServer({ host: '0.0.0.0', port: PORT });
const serverIp = getLocalIpAddress();

console.log("Servidor creado");
console.log("IP: ", serverIp);
console.log("Port: ", PORT);

wss.on('connection', (ws) => {
  console.log('Cliente connectado');

  clients.add(ws);

  ws.on('message', (data) => {
    console.log('Message from client:', data.toString());
    for (const client of clients) {
      if (client === ws) {
          continue;
      }
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    }
  });

  ws.on('close', (code, reason) => {
    console.log('Connection closed:', code, reason.toString());
  });

  ws.on('error', (error) => {
    console.error('Websocket error:', error);
    clients.delete(ws)
  });
});


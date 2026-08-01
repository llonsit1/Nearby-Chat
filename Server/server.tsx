import express, { type Express, type Request, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import { networkInterfaces } from 'os';

const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const WS_PORT = 3000;

function getLocalIpAddress() {
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    if (interfaces[name] === undefined) {
        continue;
    }
    for (const netInterface of interfaces[name]) {
      if (netInterface.family === 'IPv4' && !netInterface.internal) return netInterface.address;
    }
  }
  return '127.0.0.1';
}


const storage = multer.diskStorage({
    destination: "./uploads",
    filename(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file received' });
  }

  const fileInfo = {
    name: req.file.originalname,
    storedName: req.file.filename,
    size: req.file.size,
    extension: path.extname(req.file.originalname).replace('.', ''),
    url: `/files/${req.file.filename}`,
  };
  res.status(200).json(fileInfo);

});

// HTTP endpoint
app.get("/messages", (req, res) => {
    res.json([
        {
            id: 1,
            from: "Alice",
            text: "Hello"
        }
    ]);
});

app.use("/files", express.static("./uploads"));

// WebSocket
wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (data) => {
        console.log(data.toString());

        // Broadcast to everyone
        for (const client of wss.clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        }
    });

    ws.on("close", () => {
        console.log("Disconnected");
    });
});

server.listen(WS_PORT, () => {
    console.log("Servidor creado");
    console.log("IP: ", getLocalIpAddress())
    console.log("Port: ", WS_PORT);
});
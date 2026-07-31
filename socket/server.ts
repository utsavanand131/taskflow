import "dotenv/config";

import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

import { verifyToken } from "../lib/jwt";

const app = express();

app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required."));
    }

    const payload = verifyToken(token);

    socket.data.userId = payload.userId;

    next();
  } catch {
    next(new Error("Invalid token."));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;

  socket.join(userId);

  console.log("Socket connected:", socket.id, "User:", userId);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.post("/notify", (req, res) => {
  const { userId, notification } = req.body;

  io.to(userId).emit("notification", notification);

  res.json({
    success: true,
  });
});

const PORT = 4000;

httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});

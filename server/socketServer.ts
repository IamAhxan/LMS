import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
  // 1. Initialize the Socket.IO server with CORS options
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // 2. Listen for client connections
  io.on("connection", (socket: any) => {
    console.log("A user connected");

    // 3. Listen for specific events ON the connected socket
    socket.on("notification", (data: any) => {
      io.emit("notification", data); // Broadcast the notification to all connected clients
    });

    // Optional: Handle disconnections gracefully
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

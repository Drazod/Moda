
import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

// Helper: get userId from handshake query (or token if you want to add JWT auth)
function getUserIdFromSocket(socket: any): string | undefined {
  // Example: client connects with ws://.../?userId=123
  return socket.handshake.query.userId as string | undefined;
}

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    const userId = getUserIdFromSocket(socket);
    if (userId) {
      socket.join(userId); // Join a room named after the userId
      console.log(`Socket ${socket.id} joined room for user ${userId}`);
    } else {
      console.log("Socket connected without userId:", socket.id);
    }
    
    // Handle typing indicator
    socket.on('typing', (data: { conversationId: number; receiverId: number; isTyping: boolean }) => {
      io.to(String(data.receiverId)).emit('user-typing', {
        conversationId: data.conversationId,
        userId: userId,
        isTyping: data.isTyping
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

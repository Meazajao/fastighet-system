import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Ansluten:", socket.id);

  socket.on("join-ticket", (ticketId: string) => {
    socket.join(ticketId);
    console.log(`${socket.id} gick med i rum: ${ticketId}`);
  });

  socket.on("join-admin", () => {
    socket.join("admin-room");
    console.log(`${socket.id} gick med i admin-rum`);
  });

  socket.on("join-user", (userId: string) => {
    socket.join(`user-${userId}`);
    console.log(`${socket.id} gick med i user-rum: user-${userId}`);
  });

  socket.on("send-message", (data: { ticketId: string; message: any }) => {
    io.to(data.ticketId).emit("new-message", data.message);
  });

  socket.on("new-ticket-created", (ticket: { id: string; title: string; category: string; userName: string }) => {
    io.to("admin-room").emit("new-ticket", ticket);
  });

  socket.on("status-changed", (data: { ticketId: string; title: string; status: string; userId: string }) => {
    io.to(`user-${data.userId}`).emit("status-updated", {
      ticketId: data.ticketId,
      title: data.title,
      status: data.status,
    });
  });

  socket.on("admin-message-sent", (data: { ticketId: string; title: string; userId: string }) => {
    io.to(`user-${data.userId}`).emit("new-admin-message", {
      ticketId: data.ticketId,
      title: data.title,
    });
  });

  socket.on("disconnect", () => {
    console.log("Frånkopplad:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Socket.io-server körs på port 3001");
});
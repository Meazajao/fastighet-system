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

  socket.on("send-message", (data: { ticketId: string; message: unknown }) => {
    io.to(data.ticketId).emit("new-message", data.message);
  });

  socket.on("new-ticket-created", (ticket: { id: string; title: string; category: string; userName: string }) => {
    io.to("admin-room").emit("new-ticket", ticket);
  });

  socket.on("disconnect", () => {
    console.log("Frånkopplad:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Socket.io-server körs på port 3001");
});
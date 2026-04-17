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

  socket.on("send-message", (data: { ticketId: string; message: unknown }) => {
    io.to(data.ticketId).emit("new-message", data.message);
  });

  socket.on("disconnect", () => {
    console.log("Frånkopplad:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Socket.io-server körs på port 3001");
});
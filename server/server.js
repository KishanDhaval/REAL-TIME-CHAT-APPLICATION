const express = require("express");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const chatRoutes = require("./routes/chatRoute");
const massageRoutes = require("./routes/massageRoute");
const { Socket } = require("socket.io");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

connectDB();

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", massageRoutes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// socket stuff
const io = require("socket.io")(server, {
  pingTimeour: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    
    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
        
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup" ,()=>{
    socket.leave(userData._id)
  })
});

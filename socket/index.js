const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
        console.log(users);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    console.log("getUser");
    console.log(userId);
    console.log(users);
    console.log("end")
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("addUser", (userId) => {
    const user = { userId, socketId: socket.id };
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        console.log(receiverId);
        const user = getUser(receiverId);
        console.log("qhkw")
        console.log(user);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

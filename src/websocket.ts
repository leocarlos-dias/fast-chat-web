import { io } from "./app";
import { messages, users } from "./database";
import { IMessage } from "./interfaces";


io.on("connection", (socket) => {
    socket.on("selectedRoom", ({ username, room, bio }, returnMessagesInRoom) => {
        socket.join(room)
        const socketId = socket.id
        const userInRoom = users.find(user => user.username === username && user.room === room);

        if (!userInRoom) {
            users.push({
                username,
                room,
                bio,
                socketId: socket.id,
                isOnline: true,
            })
        } else {
            userInRoom.socketId = socketId,
                userInRoom.isOnline = true,
                userInRoom.bio = bio;
        }

        const messagesInRoom = messages.filter(message => message.room === room);
        returnMessagesInRoom(messagesInRoom);

        io.to(room).emit("userStatus", users);
    });

    socket.on("message", content => {
        const user = users.find(user => user.socketId === socket.id)

        if (!user) {
            return;
        } else {
            user.isOnline = true;
        }

        const { username, room, isOnline, bio } = user;
        const message: IMessage = {
            username,
            room,
            isOnline,
            bio,
            content,
            createdAt: new Date().toString(),
        }

        messages.push(message);

        io.to(room).emit("message", message);
        io.to(room).emit("userStatus", users);
    });

    socket.on("userDisconnect", ({ username, room }) => {
        const userInRoom = users.find(user => user.username === username && user.room === room);

        if (userInRoom) {
            userInRoom.isOnline = false;
        };

        io.to(room).emit("userStatus", users);
    });
});


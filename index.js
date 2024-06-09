const express  = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");
const messageRoute = require("./routes/messagesRoute.js");
const socket = require('socket.io');

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

const allowedOrigins = ["http://localhost:3000", "https://resilient-squirrel-7496d9.netlify.app"];

app.use(cors(
    // {
    //     origin: function (origin, callback) {
    //         if (!origin) return callback(null, true); // Allow non-origin requests like mobile apps
    //         if (allowedOrigins.indexOf(origin) === -1) {
    //             const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
    //             return callback(new Error(msg), false);
    //         }
    //         return callback(null, true);
    //     },
    //     credentials: true
    // })
))
app.use(express.json());

try {
    mongoose.connect(`${process.env.dbUrl}/${process.env.dbName}`)
    console.log("Db Connected Successfully")
} catch (error) {
    res.status(500).send({message:"Internal Server Error",
        error:error.message
        })
    console.log(error)
}

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

const server = app.listen(PORT,
    () => {
        console.log(`Server is running on the port ${PORT}`);
    })

const io = socket(server,{
    cors:{
        origin:"allowedOrigins",
        credentials: true,
        methods: ['GET', 'POST'],
    }
});
global.onlineUsers = new Map();

 io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        // console.log("sendmsg", { data });
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    })
 })    
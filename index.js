import cors from "cors";
import express from "express";
const app = express();
import http from "http";
import { Server } from "socket.io";
const server = http.createServer(app);

const SocketIo = new Server(server);

/* process env allowed */
import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";

/* import middlewares */
import notFound from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

/* import routes */
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profiles/index.js";
import likeRouter from "./routes/likes/index.js";
import referralRouter from "./routes/referral/index.js";
import gemsRouter from "./routes/gems/index.js";
import chatRouter from "./routes/chat/index.js";
import adminRouter from "./routes/admin/auth.js";
import adminUserRouter from "./routes/admin/user.js";
import adminReferralRouter from "./routes/admin/referral.js";
import adminGemRouter from "./routes/admin/gems.js";
import adminSuperLikeRouter from "./routes/admin/superlike.js";
import adminMatchesRouter from "./routes/admin/match.js";
import mongoose from "mongoose";

app.use(cors());
app.use(
  express.json({ extended: true, parameterLimit: 100000, limit: "500mb" })
);
app.use(express.static("public"));

app.use("/media", express.static("media"));

app.get("/", (req, res) => {
  res.json({ msg: "welcome" });
});

app.get("/home", (req, res) => {
  res.json({ msg: "home" });
});

app.use("/api/", authRouter);
app.use("/api/", profileRouter);
app.use("/api/", likeRouter);
app.use("/api/", referralRouter);
app.use("/api/", gemsRouter);
app.use("/api/", chatRouter);

app.use("/api/admin", adminRouter);
app.use("/api/admin", adminUserRouter);
app.use("/api/admin", adminReferralRouter);
app.use("/api/admin", adminGemRouter);
app.use("/api/admin", adminSuperLikeRouter);
app.use("/api/admin", adminMatchesRouter);

/*
********************************
 @Events For Socket Connection  
********************************
*/

import { chatsSocket } from "./controller/chatController.js";

SocketIo.on("connection", (socket) => {
  console.log("socket client connect");

  socket.on("chatConnect", async (s_id) => {
    console.log("sender id", s_id);

    const data = await chatsSocket(s_id)

    // console.log(data);

     socket.emit("chatConnect", data)
  })

  socket.on("disconnect", () => console.log("socket client disconnect"));  
});

/*
********************************
 @End Events  
********************************
*/

app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    const port = process.env.PORT || 5000;
    const urlHost = process.env.APP_URL;

    server.listen(port, () => console.log(`server is listening at ${urlHost}`));
  } catch (error) {
    console.log(error);
  }
};

start();

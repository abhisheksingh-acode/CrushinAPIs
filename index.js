import cors from "cors";
import express from "express";
const app = express();

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
import gemsRouter from "./routes/gems/index.js"
import mongoose from "mongoose";

app.use(cors());
app.use(express.json());

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

    app.listen(port, () => console.log(`server is listening at ${urlHost}`));
  } catch (error) {
    console.log(error);
  }
};

start();

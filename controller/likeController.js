import User from "../models/User.js";
import Like from "../models/Like.js";
import Dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

/* likes for account logged */
const likes = async (req, res) => {
  const user_id = req.params.user_id;

  const data = await Like.find()
    .where({ user_id, status: true, action: true })
    .populate({ path: "user_id", select: "name profile" })
    .populate({ path: "profile_id", select: "name profile" });

  res.status(StatusCodes.OK).json(data);
};

const requests = async (req, res) => {
  const user_id = req.params.user_id;
  const data = await Like.findOne().where("user_id").equals(user_id).exec();

  res.status(StatusCodes.OK).json(data);
};

const detail = async (req, res) => {
  const user_id = req.params.id;
  const data = await Like.findOne().where("user_id").equals(user_id).populate("user")

  res.status(StatusCodes.OK).json(data);
};

export { likes, requests, detail };

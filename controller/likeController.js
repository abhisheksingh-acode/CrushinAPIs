import User from "../models/User.js";
import Like from "../models/Like.js";
import Dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

/* likes for account logged */
const likes = async (req, res) => {
  const user_id = req.params.user_id;

  const data = await Like.find()
  .where("user_id")
  .equals(user_id)
  .exec();
  // try {

    res.status(StatusCodes.OK).json(data);


};

const requests = async (req, res) => {
  const user_id = req.params.user_id;
  const data = await Like.find()
    .where("user_id")
    .equals(user_id)
    .where("status")
    .equals(true)
    .where("accept")
    .equals(false)
    .exec();

  res.status(StatusCodes.OK).json(data);
};

export { likes, requests };

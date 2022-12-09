import Chat from "../models/Chat.js";
import Like from "../models/Like.js";

import { StatusCodes } from "http-status-codes";

// import custom error methods
import { IfExist, IfRequired } from "../errors/registerError.js";

const chats = async (req, res) => {
  if (req.params.user_id == null) {
    throw new IfRequired("cannot access user information");
  }
  const user_id = req.params.user_id;

  const data = await Like.find()
    .and([
      { $or: [{ user_id: user_id }, { profile_id: user_id }] },
      { $or: [{ accept: true }] },
    ])
    .exec();

    




  res.json(data);
};
const connect = async (req, res) => {
  res.json({ send: true });
};
const post = async (req, res) => {
  res.json({ send: true });
};
const destroy = async (req, res) => {
  res.json({ send: true });
};

export { chats, connect, post, destroy };

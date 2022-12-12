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

  const data = await Chat.find()
    .and([{ $or: [{ user_id: user_id }, { profile_id: user_id }] }])
    .populate({ path: "user_id", select: "name profile _id" })
    .populate({ path: "profile_id", select: "name profile _id" })
    .exec();

  res.json(data);
};

const connect = async (req, res) => {
  if (req.params.user_id == null || req.params.profile_id == null) {
    throw new IfRequired("cannot create chat room without user access");
  }
  const user_id = req.params.user_id;
  const profile_id = req.params.profile_id;

  const messages = await Chat.find()
    .where("user_id")
    .equals(user_id)
    .where("profile_id")
    .equals(profile_id)
    .populate({ path: "user_id", select: "name profile age" })
    .populate({ path: "profile_id", select: "name profile age" })
    .sort("-_id")

  res.json({ messages });
};

const post = async (req, res) => {
  if (req.params.user_id == null || req.params.profile_id == null) {
    throw new IfRequired("cannot send message: some params are not receieved");
  }
  const user_id = req.params.user_id;
  const profile_id = req.params.profile_id;

  const data = await Chat.create({
    user_id,
    profile_id,
    ...req.body,
    read: true,
  });

  const all = await Chat.find({
    user_id,
    profile_id,
  })
  .populate({ path: "user_id", select: "name profile age" })
    .populate({ path: "profile_id", select: "name profile age" })
    .sort("-_id")
    .exec();

  res.json({ data, all });
};

const destroy = async (req, res) => {
  res.json({ send: true });
};

export { chats, connect, post, destroy };

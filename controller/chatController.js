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

  const match = await Like.find()
    .where({
      $or: [{ user_id: user_id }, { profile_id: user_id }],
      accept: true,
    })
    .populate({ path: "user_id", select: "name _id profile age" })
    .populate({ path: "profile_id", select: "name _id profile age" });

  const findLast = async (uid, pid) => {
    const lastMessage = await Chat.find()
    .where({
      $or: [
        {user_id: uid, profile_id: pid},
        {profile_id: uid, user_id: pid},
      ]
    })
      .sort("-_id")
      .limit(1);
    return lastMessage;
  };

  const newMatch = match.map((el, index) => {
    // let openChatID = `${el.user_id._id}${el.profile_id._id}`;

    const lastMessage = findLast(el.user_id._id, el.profile_id._id);

    return { ...el._doc, last: lastMessage };
  });

  res.json(newMatch);
};



const connect = async (req, res) => {
  if (req.params.chat_id == null || req.params.chat_id == null) {
    throw new IfRequired("chat room does not exist");
  }
  const chat_id = req.params.chat_id;

  const messages = await Chat.find({ chat_id })
    .populate({ path: "user_id", select: "name profile age" })
    .populate({ path: "profile_id", select: "name profile age" })
    .sort("-_id");

  res.json({ messages });
};


const post = async (req, res) => {
  if (req.params.user_id == null || req.params.profile_id == null) {
    throw new IfRequired("cannot send message: some params are not receieved");
  }
  const user_id = req.params.user_id;
  const profile_id = req.params.profile_id;

  let openChatID = `${user_id}${profile_id}`;

  const data = await Chat.create({
    chat_id:openChatID,
    s_id:user_id,
    r_id: profile_id,
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

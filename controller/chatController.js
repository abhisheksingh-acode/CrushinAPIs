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
    .populate({ path: "user_id", select: "name _id profile gender" })
    .populate({ path: "profile_id", select: "name _id profile gender" });

  const findLast = async (uid, pid) => {
    const lastMessage = await Chat.findOne()
      .where({
        $or: [
          { s_id: uid, r_id: pid },
          { r_id: uid, s_id: pid },
        ],
      })
      .sort("-_id")
      .limit(1);
    return lastMessage;
  };

  const newMatch = await Promise.all(
    match.map(async (el, index) => {
      // let openChatID = `${el.user_id._id}${el.profile_id._id}`;
      const lastMessage = await findLast(el.user_id._id, el.profile_id._id);

      console.log(lastMessage);
      return {
        ...el._doc,
        last: lastMessage,
        sortid: lastMessage !== null ? lastMessage.date : el.profile_id.date,
      };
    })
  );

  let descresult = newMatch.sort(
    (a, b) => Date.parse(new Date(b.sortid)) - Date.parse(new Date(a.sortid))
  );

  res.json(descresult);
};

const connect = async (req, res) => {
  if (req.params.s_id == null || req.params.r_id == null) {
    throw new IfRequired("chat room does not exist");
  }
  const s_id = req.params.s_id;
  const r_id = req.params.r_id;

  const messages = await Chat.find()
    .where({
      $or: [
        { s_id: s_id, r_id: r_id },
        { s_id: r_id, r_id: s_id },
      ],
    })
    .populate({ path: "s_id", select: "name profile age" })
    .populate({ path: "r_id", select: "name profile age" })
    .sort("-_id");

  await Chat.find()
    .where({
      $or: [
        { s_id: s_id, r_id: r_id },
        { s_id: r_id, r_id: s_id },
      ],
    })
    .update({ $set: { read: true } });

  res.json({ messages });
};

const post = async (req, res) => {
  if (req.params.user_id == null || req.params.profile_id == null) {
    throw new IfRequired("cannot send message: some params are not receieved");
  }
  const user_id = req.params.user_id;
  const profile_id = req.params.profile_id;

  const { type, content } = req.body;

  let openChatID = `${user_id}${profile_id}`;

  const data = await Chat.create({
    s_id: user_id,
    r_id: profile_id,
    type,
    content,
    read: false,
  });

  const all = await Chat.find({
    user_id,
    profile_id,
  })
    .populate({ path: "s_id", select: "name profile age" })
    .populate({ path: "r_id", select: "name profile age" })
    .sort("-_id")
    .exec();

  res.json({ data, all });
};

const destroy = async (req, res) => {
  res.json({ send: true });
};

export { chats, connect, post, destroy };

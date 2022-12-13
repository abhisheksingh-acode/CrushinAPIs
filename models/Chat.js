import mongoose from "mongoose";

import User from "./User.js";

const ChatSchema = new mongoose.Schema({
  s_id: {
    type : mongoose.Types.ObjectId,
    ref : 'User'
  },
  r_id: {
    type : mongoose.Types.ObjectId,
    ref : 'User'
  },
  content: {
    type: String,
    required: [true, "transaction is required"],
  },
  type: {
    type: Boolean,
    required: [true, "chat type is required text/file"],
  },
  read: {
    type: Boolean,
    default: false,
  },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", ChatSchema);

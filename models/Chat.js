import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "user id is required"],
  },
  profile_id: {
    type: String,
    required: [true, "profile id is required"],
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

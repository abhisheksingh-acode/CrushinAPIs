import mongoose from "mongoose";

const SUBJECT = {
  LIKED: "Profile liked",
  SUPERLIKED: "Profile superliked",
  REFERRAL: "Referral reward",
};

const NOTIFICATION = {
  LIKED: "someone likes you",
  SUPERLIKED: "someone gives you super like",
  REFERRAL: "you have referred successfully",
  GEMS: "gems credited in your wallet",
};

const NotificationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "user id is required"],
  },
  subject: {
    type: String,
    required: [true, "subject is required"],
  },
  notification: {
    type: String,
    required: [true, "notification description is required"],
  },
  read: {
    type: Boolean,
    default: false,
  },
  time: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
export { SUBJECT, NOTIFICATION };

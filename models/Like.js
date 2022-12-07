import mongoose from "mongoose";

import SuperLike from "./SuperLike.js";

const LABEL = {
  PENDING: "pending",
  ACCEPT: "accepted",
  REJECT: "rejected",
};
const ACTION = {
  LIKED: "like",
  DISLIKED: "dislike",
};

const LikeSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "user id is required"],
  },
  profile_id: {
    type: String,
    required: [true, "profile id is required"],
  },
  label: {
    type: String,
    required: [true, "stutus label is required"],
    default: LABEL.PENDING,
  },
  action: {
    type: String,
  },
  // like or dislike
  status: {
    type: Boolean,
    required: [true],
    default: false,
  },
  isSuper: {
    type: Boolean,
    default: false,
  },
  // nos for super like available
  available: {
    type: Number,
    default: 0,
  },
  accept: {
    type: Boolean,
    default: false,
  },
  date: { type: Date, default: Date.now },
});

LikeSchema.pre("save", async function () {
  if (this.status && this.accept) {
    this.label = LABEL.ACCEPT;
  } else if (this.status && !this.accept) {
    this.label = LABEL.REJECT;
  } else {
    this.label = LABEL.PENDING;
  }
  if (this.SuperLike) {
    const updateWallet = await SuperLike.create({
      user_id: this.user_id,
      available: this.available,
      transaction: 1,
      type: false,
    });
  }
});

LikeSchema.pre("updateOne", async function () {
  if (this.status && this.accept) {
    this.label = LABEL.ACCEPT;
  } else if (this.status && !this.accept) {
    this.label = LABEL.REJECT;
  } else {
    this.label = LABEL.PENDING;
  }
});

export default mongoose.model("Like", LikeSchema);

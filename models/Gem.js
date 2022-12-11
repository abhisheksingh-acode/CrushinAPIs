import mongoose from "mongoose";

import User from "./User.js";
import SuperLike from "./SuperLike.js";

const TRANSACTION = {
  PURCHASE: 5,
  REWARD: 6,
};

const LABEL = {
  PURCHASE: "purchase",
  REWARD: "reward",
};

const TYPE = {
  CREDIT: "credit",
  DEBIT: "debit",
};

const GemSchema = new mongoose.Schema({
  user_id: {
    type : mongoose.Types.ObjectId,
    ref : 'User'
  },
  available: {
    type: Number,
    required: [true, "transaction is required"],
  },
  transaction: {
    type: Number,
    required: [true, "transaction is required"],
  },
  type: {
    type: Boolean,
    required: [true, "type is required for credit/debit"],
  },
  label: {
    type: String,
  },
  date: { type: Date, default: Date.now },
});

GemSchema.pre("save", async function () {
  if (this.type) {
    this.status = TYPE.CREDIT;
    this.label = LABEL.REWARD;
    this.available += this.transaction;
  } else {
    this.status = TYPE.DEBIT;
    this.label = LABEL.PURCHASE;
    this.available -= this.transaction;
  }
});

export default mongoose.model("Gem", GemSchema);

export { TRANSACTION };

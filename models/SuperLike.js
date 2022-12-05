import mongoose from "mongoose";

const LABEL = {
  PURCHASE: "purchase",
  PROFILE: "profile",
};

const TYPE = {
  CREDIT: "credit",
  DEBIT: "debit",
};

const PRICE = 1;
const QUANTITY = 3;

const SuperLikeSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "user id is required"],
  },
  available: {
    type: Number,
    required: true,
  },
  transaction: {
    type: Number,
    required: true,
  },
  type: {
    type: Boolean,
    required: [true],
  },
  label: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

SuperLikeSchema.pre("save", async function () {
  if (this.type) {
    this.label = LABEL.PURCHASE;
    this.available += this.transaction;
  } else {
    this.label = LABEL.PROFILE;
    this.available -= this.transaction;
  }
});

export default mongoose.model("SuperLike", SuperLikeSchema);

export {PRICE, QUANTITY}
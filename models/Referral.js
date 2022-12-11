import mongoose from "mongoose";

const STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  EXPIRED: "expire",
};

const ReferralSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  phone: {
    type: String,
    required: [true, "profile id is required"],
  },
  label: {
    type: String,
    required: [true, "status label is required"],
  },
  status: {
    type: Boolean,
    required: [true, "status is required"],
  },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Referral", ReferralSchema);

export { STATUS };

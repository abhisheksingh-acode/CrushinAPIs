import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  phone: {
    type: Number,
    required: [true, "phone is required"],
  },
  otp: {
    type: String,
    required: [true, "otp is required"],
  },
  date: { type: Date, default: Date.now },
});


export default mongoose.model("Otp", OtpSchema);

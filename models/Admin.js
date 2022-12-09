import mongoose from "mongoose";
import validator from "validator";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* allow process env method  */
import dotenv from "dotenv";
dotenv.config();

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: "provide a valid email address",
    },
    unique: [true, "email is already in use."],
  },
  name: {
    type: String,
    minlength: "2",
    trim: true,
    required: [true, "name is required"],
  },
  password: {
    type: String,
    minlength: 8,
  },
});

AdminSchema.pre("save", async function () {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

AdminSchema.methods.createJWT = function () {
  return Jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export default mongoose.model("Admin", AdminSchema);

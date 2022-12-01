import mongoose from "mongoose";
import validator from "validator";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* allow process env method  */
import dotenv from "dotenv";
dotenv.config();

const UserSchema = new mongoose.Schema({
  phone: {
    type: Number,
    required: [true, "Phone number is required"],
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: "provide a valid email address",
    },
    unique: [true, "email is already in use."],
    required: [true, "Email address is required"],
  },
  name: {
    type: String,
    minlength: "2",
    trim: true,
    required: [true, "name is required"],
  },
  lastname: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    minlength: 8,
  },
  photos: {
    type: String,
    required: [true, "photos are required"],
  },
  interests: {
    type: String,
    required: [true, "interests are required"],
    default: "not set",
  },
  gender: {
    type: String,
    required: [true, "gender is required"],
    default: "not set",
  },
  birthday: {
    type: Date,
    required: [true, "date of birth is required"],
  },
  relation_type: {
    type: String,
    required: [true, "relation type is required"],
  },
  relation_find: {
    type: String,
    required: [true, "relation find is required"],
  },
  habit_drink: {
    type: Boolean,
    required: [true, "drink selection is required"],
  },
  habit_smoke: {
    type: Boolean,
    required: [true, "smoking selection is required"],
  },
  religion: {
    type: String,
    required: [true, "religion selection is required"],
  },
  politics_view: {
    type: String,
    required: [true, "political view selection is required"],
  },
  bio: {
    type: String,
    default: "",
    min: 20,
    max: 100,
    required: [true, "bio is required"],
  },
  profile:{
   type: String,
   required: [true,'profile picture is required']
  },
  photos:{
   type: String,
  },
  location: {
    type: String,
    minlength: 3,
    maxlength: 20,
  },
});

UserSchema.pre("save", async function () {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password,saltRounds);
  
});

UserSchema.methods.createJWT = function () {
  return Jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export default mongoose.model("User", UserSchema);

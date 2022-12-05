import User from "../models/User.js";
import Referral from "../models/Referral.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Dotenv from "dotenv";
import mongoose from "mongoose";

import { STATUS } from "../models/Referral.js";

import availableGems from "../helpers/gems.js";
import availableSuperLikes from "../helpers/superLikes.js";

// allow env
Dotenv.config();

// import custom error methods
import { IfExist, IfRequired } from "../errors/registerError.js";

function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

const users = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json(users);
};

const account = async (req, res) => {
  const user_id = req.params.user_id;
  const user = await User.findOne({ _id: user_id });
  const gems = await availableGems(user_id);
  const superlikes = await availableSuperLikes(user_id);

  res.status(StatusCodes.OK).json({ user, gems, superlikes });
};

const register = async (req, res) => {
  try {
    if (isEmptyObject(req.body)) {
      throw new IfRequired("please provide all required inputs");
    }
    const UserExist = await User.findOne(req.body);

    if (UserExist) {
      throw new IfExist(
        "You're entering duplicate entries. Try with diffrent one."
      );
    }

    let profile = JSON.stringify(
      req.files["profile"][0] ? req.files["profile"][0].filename : ""
    );
    let photos = req.files["photos"] ? req.files["photos"] : [];

    if (photos != null && photos.length >= 0) {
      photos = photos.map((photo) => {
        return photo.filename;
      });
    }
    photos = JSON.stringify(photos);

    let createFormData = req.body;

    createFormData = { ...createFormData, profile, photos };

    let user = await User.create(createFormData);

    const checkRef = await Referral.findOne({ phone: req.body.phone });

    if (checkRef) {
      await checkRef.updateOne({ status: true, label: STATUS.SUCCESS });
    }

    let token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user, token });
  } catch (error) {
    throw new Error(error);
  }
};

const destroy = async (req, res) => {
  const find = req.params.find;
  const user = await User.findOne({ find });
  if (user) {
    const destroyedUser = await User.deleteOne({ find });
    res.status(200).json({ message: "user Deleted", destroyedUser });
  } else {
    res.status(200).json({ message: "user not existed" });
  }
};

const loginRequest = async (req, res) => {
  if (isEmptyObject(req.body)) {
    throw new IfRequired("please provide all required inputs");
  }
  const { phone } = req.body;

  const user = await User.findOne({ phone });

  if (!user) {
    throw new IfRequired("invalid phone number");
  }

  const otp = Math.floor(Math.random() * 10000);
  await user.updateOne({ phoneotp: otp });

  res.status(StatusCodes.OK).json({ otp });
};

const loginVerify = async (req, res) => {
  if (isEmptyObject(req.body)) {
    throw new IfRequired("please provide all required inputs");
  }
  const { otp, phone } = req.body;

  // find user by email
  const user = await User.findOne({ phone });

  if (!user) {
    throw new IfRequired("invalid credentials try with correct one.");
  }

  const checkPassword = otp == user.phoneotp ? true : false;

  if (user && checkPassword) {
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ token, user });
  }
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: "invalid otp try again." });
};

const logout = async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
      if (logout) {
        res.status(StatusCodes.OK).json({ message: "session logged out." });
      } else {
        throw new Error("Something went wrong !!");
      }
      throw new Error(err);
    });
  }
};

const reset = (req, res) => {
  res.send("reset");
};
const update = async (req, res) => {
  if (!req.params.userid) {
    throw new IfRequired("please provide all required inputs");
  }

  const find = await User.findOne({
    _id: mongoose.Types.ObjectId(req.params.userid),
  });

  if (find) {
    await find.updateOne(req.body);
  }

  const user = await User.findOne({
    _id: mongoose.Types.ObjectId(req.params.userid),
  });

  res.status(200).json({ message: "updated successfully", user });
};

export {
  register,
  loginRequest,
  loginVerify,
  logout,
  reset,
  destroy,
  update,
  users,
  account,
};

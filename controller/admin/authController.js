import Admin from "../../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";

import Referral, { STATUS } from "../../models/Referral.js";

import availableGems from "../../helpers/gems.js";
import availableSuperLikes from "../../helpers/superLikes.js";

// allow env
Dotenv.config();

// import custom error methods
import { IfExist, IfRequired } from "../../errors/registerError.js";

function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

const user = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json(users);
};

const register = async (req, res) => {
  try {
    if (isEmptyObject(req.body)) {
      throw new IfRequired("please provide all required inputs");
    }
    const UserExist = await Admin.findOne({ email: req.body.email });

    if (UserExist) {
      throw new IfExist(
        "You're entering duplicate entries. Try with diffrent one."
      );
    }

    let user = await Admin.create(req.body);

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

const login = async (req, res) => {
  if (isEmptyObject(req.body)) {
    throw new IfRequired("please provide all required inputs");
  }
  const { email, password } = req.body;

  // find user by email
  const user = await Admin.findOne({ email });

  if (user !== null) {
    const checkPassword = bcrypt.compare(password, user.password);
    if (user && checkPassword) {
      const token = user.createJWT();
      res.status(StatusCodes.OK).json({ token, user });
      return;
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "bad password recieved, enter correct one.",
      });
    }
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: true, message: "Wrong credentials are given." });
  }
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
export { register, user, login, logout };

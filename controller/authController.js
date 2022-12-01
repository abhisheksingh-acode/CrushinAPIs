import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Dotenv from "dotenv";

// allow env
Dotenv.config();

// import custom error methods
import { IfExist, IfRequired } from "../errors/registerError.js";
import { response } from "express";

function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

const users = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).send(users);
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
  const user = await User.findOne({ email });

  if (!user) {
    throw new IfRequired("invalid credentials try with correct one.");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (user && checkPassword) {
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ token, user, email });
  }
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: "invalid credentials try with correct one." });
};


const logout = async (req, res) => {
     const authHeader = req.headers['authorization'];

     if(authHeader){
        jwt.sign(authHeader,"",{expiresIn: 1},(logout, err) => {
          if (logout) {
            res.status(StatusCodes.OK).json({message:"session logged out."});
            } else {
            throw new Error('Something went wrong !!')
            }
            throw new Error(err)

        });
     }
}

const reset = (req, res) => {
  res.send("reset");
};
const update = (req, res) => {
  res.send("update");
};

export { register, login, logout, reset, destroy, update, users };

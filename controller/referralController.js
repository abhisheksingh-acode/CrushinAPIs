import User from "../models/User.js";

import { StatusCodes } from "http-status-codes";
import Referral from "../models/Referral.js";

import {STATUS} from "../models/Referral.js";


const generate = async (req, res) => {
  const user_id = req.body.user_id;
  const code = user_id.slice(0, 10);
  res.status(StatusCodes.OK).json({ code });
};

const history = async (req, res) => {
  const user_id = req.body.user_id;
  const data = await Referral.find({ user_id }).sort("-date");
  res.status(StatusCodes.OK).json(data);
};

const register = async (req, res) => {
  const user_id = req.body.user_id;
  const phone = req.body.phone;
  const data = await Referral.create({
    user_id,
    phone,
    status: false,
    label: STATUS.PENDING,
  });
  res.status(StatusCodes.OK).json(data);
};

const check = async (req, res) => {
  const id = req.params.id;
  const data = await Referral.findOne({_id: id});
  res.status(StatusCodes.OK).json(data);
};

export { generate, history, register, check };

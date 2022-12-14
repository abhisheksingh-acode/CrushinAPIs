import Admin from "../../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";

import Referral, { STATUS } from "../../models/Referral.js";

import availableGems, {gems_history} from "../../helpers/gems.js";
import availableSuperLikes from "../../helpers/superLikes.js";

// allow env
Dotenv.config();

// import custom error methods
import { IfExist, IfRequired } from "../../errors/registerError.js";
import User from "../../models/User.js";
import Gem from "../../models/Gem.js";
import SuperLike from "../../models/SuperLike.js";

function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

const account = async (req, res) => {
  const user_id = req.params.user_id;
  const user = await User.findOne({ _id: user_id });
  const gems = await availableGems(user_id);
  const gemsHistory = await gems_history(user_id);
  const superlikes = await availableSuperLikes(user_id);

  res.status(StatusCodes.OK).json({ user, gems, superlikes, gemsHistory });
};
export { account };

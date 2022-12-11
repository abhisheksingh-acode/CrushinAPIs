import User from "../models/User.js";
import Like from "../models/Like.js";
import SuperLike from "../models/SuperLike.js";
import Dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import Gem from "../models/Gem.js";

import { PRICE, QUANTITY } from "../models/SuperLike.js";

/* profiles */
const purchase = async (req, res) => {
  const user_id = req.params.user_id;

  const transaction = req.body.transaction;

  const price = Math.ceil((transaction / QUANTITY) * PRICE);


  const gems = await Gem.findOne()
    .where("user_id")
    .select("available")
    .equals(user_id)
    .sort("-_id")
    .exec();

  const superlikes = await SuperLike.findOne()
    .where("user_id")
    .equals(user_id)
    .sort("-_id")
    .exec();

  const gemAvail = gems ? gems.available : 0;
  const superlikesAvail = superlikes ? superlikes.available : 0;

  if (gemAvail < price) {
    res.status(StatusCodes.OK).json({ message: "insufficient gems" });
    return;
  }

  /*  credit super likes */
  const credit = {
    user_id,
    available: superlikesAvail ? superlikesAvail : 0,
    transaction: transaction,
    type: true,
  };
  const creditR = await SuperLike.create(credit);

  /*  debit gems */
  const debit = {
    user_id,
    transaction: price,
    type: false,
    available: gemAvail,
  };
  const debitR = await Gem.create(debit);

  res.status(StatusCodes.OK).json({
    superlikes: creditR.available,
    gems: debitR.available,
    message: "purchase done successfully",
  });
};

const transactions = async (req, res) => {
  const data = await SuperLike.find().sort("-_id").exec();

  res.status(StatusCodes.OK).json(data);
};

const history = async (req, res) => {
  const user_id = req.params.user_id;

  const available = await SuperLike.find()
    .where("user_id")
    .equals(user_id)
    .sort("-_id")
    .exec();

  res.status(StatusCodes.OK).json(available);
};

export { purchase, transactions, history };

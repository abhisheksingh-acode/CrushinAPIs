import Gem from "../models/Gem.js";
import User from "../models/User.js";
import Referral from "../models/Referral.js";
import { StatusCodes } from "http-status-codes";

import { TRANSACTION } from "../models/Gem.js";

const available = async (req, res) => {
  const user_id = req.params.user_id;

  const available = await Gem.findOne()
    .where("user_id")
    .select("available")
    .equals(user_id)
    .sort("-_id")
    .exec();

  res
    .status(StatusCodes.OK)
    .json({ available: available ? available.available : 0 });
};

const history = async (req, res) => {
  const user_id = req.params.user_id;

  const available = await Gem.find()
    .where("user_id")
    .equals(user_id)
    .sort("-_id")
    .exec();

  res.status(StatusCodes.OK).json(available);
};

const transactions = async (req, res) => {
  const data = await Gem.find().sort("-_id").exec();
  
  res.status(StatusCodes.OK).json(data);
};

const detail = async (req, res) => {
  const id = req.params.id;

  const data = await Gem.findOne().where("_id").equals(id).exec();

  res.status(StatusCodes.OK).json(data);
};

const credit = async (req, res) => {
  const user_id = req.params.user_id;

  const available = await Gem.findOne()
    .where("user_id")
    .select("available")
    .equals(user_id)
    .sort("-_id")
    .exec();

  const create = {
    user_id,
    transaction: TRANSACTION.REWARD,
    type: true,
    available: available ? available.available : 0,
  };

  const result = await Gem.create(create);

  res.status(StatusCodes.OK).json(result);
};

const debit = async (req, res) => {
  const user_id = req.params.user_id;

  const available = await Gem.findOne()
    .where("user_id")
    .select("available")
    .equals(user_id)
    .sort("-_id")
    .exec();

  const create = {
    user_id,
    transaction: TRANSACTION.PURCHASE,
    type: false,
    available: available ? available.available : 0,
  };

  if (create.available < TRANSACTION.PURCHASE) {
    res.status(StatusCodes.OK).json({ message: "insufficient gems" });

    return;
  }

  const result = await Gem.create(create);

  res.status(StatusCodes.OK).json(result);
};

export { credit, debit, available, history, transactions, detail };

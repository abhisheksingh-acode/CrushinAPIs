import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { StatusCodes } from "http-status-codes";

import { SUBJECT, NOTIFICATION } from "../models/Notification.js";

const getUnread = async (user_id) => {
  const result = await Notification.find()
    .where("user_id")
    .equals(user_id)
    .sort("-_id")
    .where("read")
    .equals(false)
    .exec();

  return result;
};

const create = async (user_id, subject, message) => {
  const result = await Notification.create({
    user_id,
    subject,
    notification: message,
  });

  return result;
};

const read = async (notification_id) => {
  const result = await Notification.findOne({ _id: notification_id }).updateOne(
    {
      read: true,
    }
  );

  return result;
};

export { create, read };

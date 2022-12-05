import User from "../models/User.js";
import Like from "../models/Like.js";
import SuperLike from "../models/SuperLike.js";
import Notification from "../models/Notification.js";
import { StatusCodes } from "http-status-codes";

import { SUBJECT, NOTIFICATION } from "../models/Notification.js";

/* helper function */
import { create, read } from "../helpers/createNotification.js";

/* profiles */
const profiles = async (req, res) => {
  const user_id = req.body.user_id;
  const data = await User.find()
    .select({ name: 1, birthday: 1, bio: 1, profile: 1 })
    .where({ _id: { $ne: user_id } })
    .exec();

  res.status(StatusCodes.OK).json(data);
};

/* profile view */

const profilesView = async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.body.user_id;
    const data = await User.findOne({ _id: id });

    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "something went wrong!" });
  }
};

/* like */
const profileLike = async (req, res) => {
  const profile = req.params.id;
  req.body.profile_id = profile;
  const { user_id, label, status, accept, profile_id } = req.body;
  const checkRecord = await Like.findOne({ user_id, profile_id });
  if (checkRecord) {
    res.status(StatusCodes.OK).json({ message: "liked already this profile" });

    return;
  }
  const data = await Like.create(req.body);

  const notify = create(user_id, SUBJECT.LIKED, NOTIFICATION.LIKED);

  res.status(StatusCodes.OK).json(data);
};

/* like request handle */
const profileLikeHandle = async (req, res) => {
  const likeId = req.params.id;
  // const { status, accept } = req.body;
  const like = await Like.findOne({ _id: likeId });
  await like.updateOne(req.body);
  res.status(StatusCodes.OK).json({ message: "operation succeed" });
};

/* super like */
const profileSuperLikeAvailable = async (req, res) => {
  const user_id = req.params.user_id;

  const available = await SuperLike.findOne()
    .where("user_id")
    .select("available")
    .equals(user_id)
    .sort("-_id")
    .exec();

  res
    .status(StatusCodes.OK)
    .json({ available: available ? available.available : 0 });
};

const profileSuperLike = async (req, res) => {
  const user_id = req.params.user_id;
  const profile_id = req.params.id;

  const available = await SuperLike.findOne()
    .where("user_id")
    .select("available")
    .equals(user_id)
    .sort("-_id")
    .exec();

  /* Already likes */
  const checkRecord = await Like.findOne({ user_id, profile_id });
  if (checkRecord) {
    res.status(StatusCodes.OK).json({ message: "liked already this profile" });
    return;
  }

  /* no super likes in wallet */
  const check = available ? available.available : 0;
  if (check < 1) {
    res
      .status(StatusCodes.OK)
      .json({ message: "do not have superlikes in wallet" });
    return;
  }

  const data = await Like.create({
    user_id,
    profile_id,
    status: true,
    isSuper: true,
    available: check,
  });

  res.status(StatusCodes.OK).json(data);
};

/* super dislike */
const profileDislike = async (req, res) => {
  const data = await Like.find();

  res.status(StatusCodes.OK).json(data);
};

/* filter */

const filter = async (req, res) => {
  const user_id = req.body.user_id;

  const { location, date, age } = req.body;

  const data = await User.find()
    .select({ name: 1, birthday: 1, bio: 1, profile: 1 })
    .where({ _id: { $ne: user_id } })
    .where("age")
    .gt(age.min)
    .lt(age.max)
    .where("relation_type")
    .equals(date)
    .where("location")
    .gt(location.min)
    .lt(location.max)
    .exec();

  res.status(StatusCodes.OK).json(data);
};

const notifications = async (req, res) => {
  const user_id = req.params.user_id;
  const result = await Notification.find()
    .where("user_id")
    .equals(user_id)
    .sort("-_id")
    .where("read")
    .equals(false)
    .exec();

  res.status(StatusCodes.OK).json(result);
};

export {
  profiles,
  profilesView,
  profileLike,
  profileLikeHandle,
  profileSuperLike,
  profileSuperLikeAvailable,
  profileDislike,
  filter,
};

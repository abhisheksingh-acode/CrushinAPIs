import User from "../models/User.js";
import Like from "../models/Like.js";
import SuperLike from "../models/SuperLike.js";
import Notification, {
  SUBJECT,
  NOTIFICATION,
  TYPE,
} from "../models/Notification.js";
import { StatusCodes } from "http-status-codes";

/* helper function */
import { create, read } from "../helpers/createNotification.js";

/* profiles */
const profiles = async (req, res) => {
  const user_id = req.body.user_id;

  const user = await User.findOne({ _id: user_id });

  const {
    relation_find,
    relation_type,
    habit_drink,
    habit_smoke,
    religion,
    politics_view,
    location,
    age,
  } = user;

  var profileGender = null;

  switch (relation_find) {
    case "Man":
      profileGender = ["Male"];
      break;
    case "Women":
      profileGender = ["Female"];
      break;
    case "Non binary":
      profileGender = ["Male", "Female"];
      break;
    case "I’m open for everyone":
      profileGender = ["Male", "Female", "Bisexsual", "Gay"];
      break;
  }

  const data = await User.find()
    .select({
      name: 1,
      birthday: 1,
      bio: 1,
      age: 1,
      profile: 1,
      gender: 1,
    })
    .where("gender", {
      $in: [...profileGender],
    })
    .where({
      habit_smoke,
      habit_drink,
    })
    .where("_id", { $ne: user_id });

  //

  // const likedProfiles = await Like.find()
  //   .and({
  //     $or: [{ profile_id: user_id }, { user_id: user_id }],
  //   })
  //   .select({ user_id: 1, profile_id: 1, _id: -1 })
  //   .where("user_id", { $ne: user_id })
  //   .where({ status: true, accept: false });

  const likedProfiles = await Like.find().where({ user_id: user_id });

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
  const profile = req.params.profile_id;
  req.body.profile_id = profile;

  const { user_id, label, status, accept, profile_id, action } = req.body;

  const checkRecord = await Like.findOne().where({
    $or: [
      { profile_id: user_id, user_id: profile_id },
      { user_id: user_id, profile_id: profile_id },
    ],
  });

  // if like record exist don't create like doc again just update one
  if (checkRecord) {
    const checkMyRole = checkRecord.user_id == user_id ? true : false;
    const updateRecord = await checkRecord.updateOne({
      status,
      accept,
      action,
    });

    if (updateRecord) {
      if (status && accept) {
        if (checkMyRole) {
          const notifyUser = create(
            profile_id,
            user_id,
            TYPE.MATCHED,
            SUBJECT.MATCHED,
            NOTIFICATION.MATCHED
          );
        } else {
          const notifyProfile = create(
            user_id,
            profile_id,
            TYPE.MATCHED,
            SUBJECT.MATCHED,
            NOTIFICATION.MATCHED
          );
        }
      }

      return res.status(StatusCodes.OK).json({
        message: checkMyRole
          ? "you have liked someone"
          : "you were liked by someone",
        updated: checkRecord,
      });
    }
  }

  // if like record don't exist create like doc and send notification to profile guy
  const data = await Like.create(req.body);

  if (data.status && data.action) {
    const notify = create(
      user_id,
      profile_id,
      TYPE.LIKED,
      SUBJECT.LIKED,
      NOTIFICATION.LIKED
    );
  }

  res.status(StatusCodes.OK).json(data);
};

/* like request handle */
const profileLikeHandle = async (req, res) => {
  const likeId = req.params.id;
  const like = await Like.findOne({ _id: likeId });
  const result = await like.updateOne(req.body);

  if (result && req.body.accept) {
    const notify = create(
      like.profile_id,
      like.user_id,
      TYPE.MATCHED,
      SUBJECT.MATCHED,
      NOTIFICATION.MATCHED
    );
  }
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
  const profile_id = req.params.profile_id;
  const user_id = req.params.user_id;

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

  if (data) {
    const notify = create(
      user_id,
      profile_id,
      TYPE.SUPERLIKED,
      SUBJECT.SUPERLIKED,
      NOTIFICATION.SUPERLIKED
    );
  }

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
    .where("profile_id")
    .equals(user_id)
    .populate({ path: "user_id", select: "name profile age" })
    .populate({ path: "profile_id", select: "name profile age" })
    .sort("-_id")

  res.status(StatusCodes.OK).json(result);
};

const notificationRead = async (req, res) => {
  const id = req.params.id;
  const result = await Notification.findOne({ _id: id });
  await result.updateOne({ read: true });

  res.status(StatusCodes.OK).json({ message: "marked as read" });
};

export {
  profiles,
  profilesView,
  profileLike,
  profileLikeHandle,
  profileSuperLike,
  profileSuperLikeAvailable,
  profileDislike,
  notifications,
  notificationRead,
  filter,
};

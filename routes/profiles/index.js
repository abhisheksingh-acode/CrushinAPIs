import express from "express";

const router = express.Router();

import UserTokenAuth from "../../middleware/tokenAuthenticate.js";

import {
  profiles,
  profilesView,
  profileDislike,
  profileSuperLike,
  profileSuperLikeAvailable,
  profileLike,
  profileLikeHandle,
  filter,
  notifications,
  notificationRead
} from "../../controller/profileController.js";

import { history, purchase } from "../../controller/superLikeController.js";

router.post("/profiles", UserTokenAuth, profiles);
router.post("/profiles/:id", UserTokenAuth, profilesView);

router.post("/profile/:profile_id/like", UserTokenAuth, profileLike);
router.post("/like/:id/handle", UserTokenAuth, profileLikeHandle);

router.post(
  "/profile/:user_id/superlike/available",
  UserTokenAuth,
  profileSuperLikeAvailable
);

router.post("/profile/:profile_id/superlike/:user_id", UserTokenAuth, profileSuperLike);

router.post("/profile/:user_id/transaction/superlike", UserTokenAuth, history);

router.post("/profile/:user_id/purchase/superlike", UserTokenAuth, purchase);

router.post("/profile/:profile_id/dislike", UserTokenAuth, profileDislike);

router.post("/filter/profiles", UserTokenAuth, filter);

router.post("/notifications/:user_id", UserTokenAuth, notifications);
router.post("/notifications/:id/read", UserTokenAuth, notificationRead);

export default router;

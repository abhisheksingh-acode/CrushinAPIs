import express from "express";

const router = express.Router();

import UserTokenAuth from "../../middleware/tokenAuthenticate.js";

import {
  likes,
  requests,
  detail
  // profilesView,
  // profileDislike,
  // profileSuperLike,
  // profileLike,
  // profileLikeHandle,
  // filter,
} from "../../controller/likeController.js";

router.post("/likes/:user_id/list", UserTokenAuth, likes);
router.post("/likes/:user_id/request", UserTokenAuth, requests);
router.post("/like/:id/details", UserTokenAuth, detail);
// router.post("/profiles/:id", UserTokenAuth, profilesView);

// router.post("/profile/:id/like", UserTokenAuth, profileLike);
// router.post("/like/:id/handle", UserTokenAuth, profileLikeHandle);

// router.post("/profile/:id/superlike", UserTokenAuth, profileSuperLike);

// router.post("/profile/:id/dislike", UserTokenAuth, profileDislike);

// router.post("/filter/profiles", UserTokenAuth, filter);

export default router;

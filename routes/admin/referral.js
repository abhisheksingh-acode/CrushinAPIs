import express from "express";

const router = express.Router();

import UserTokenAuth from "../../middleware/tokenAuthenticate.js";

import {
  history,
  check,
} from "../../controller/referralController.js";

router.post("/referrals", UserTokenAuth, history);
router.post("/referral/:id", UserTokenAuth, check);

export default router;

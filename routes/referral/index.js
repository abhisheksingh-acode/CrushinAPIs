import express from "express";

const router = express.Router();

import UserTokenAuth from "../../middleware/tokenAuthenticate.js";

import {
  generate,
  history,
  register,
  check,
} from "../../controller/referralController.js";

router.post("/referral/generate", UserTokenAuth, generate);

router.post("/referral/history", UserTokenAuth, history);

router.post("/referral/register", UserTokenAuth, register);

router.post("/referral/:id/check", UserTokenAuth, check);

export default router;

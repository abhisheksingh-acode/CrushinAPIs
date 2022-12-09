import express from "express";

const router = express.Router();

import UserTokenAuth from "../../middleware/tokenAuthenticate.js";

import {
  register,
  logout,
  user,
  login,
} from "../../controller/admin/authController.js";

router.post("/login", login);
router.post("/store", register);
router.post("/account", UserTokenAuth, user);
router.post("/logout", UserTokenAuth, logout);

export default router;

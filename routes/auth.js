import express from "express";
// import multer from "multer";
import path from "path";
const router = express.Router();

import {
  register,
  loginRequest,
  loginVerify,
  reset,
  update,
  users,
  account,
  destroy,
  logout,
} from "../controller/authController.js";

// middlwares auth token
import UserTokenAuth from "../middleware/tokenAuthenticate.js";

// @media uploader helper function
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./media");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//   },
// });

// const uploader = multer({ storage: storage });

router.get("/users", users);

router.post("/account/:user_id", UserTokenAuth, account);

router.post("/register", register);

router.post("/login/request", loginRequest);
router.post("/login/verify", loginVerify);

// @auth routes
router.post("/logout", UserTokenAuth, logout);
router.delete("/delete/:find", UserTokenAuth, destroy);
router.put("/update/:userid", UserTokenAuth, update);

router.post("/reset", reset);

export default router;

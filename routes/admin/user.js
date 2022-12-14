import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();

import {
  register,
  loginRequest,
  loginVerify,
  reset,
  update,
  users,
  destroy,
  logout,
} from "../../controller/authController.js";


import { account } from "../../controller/admin/userController.js";

// middlwares auth token
import UserTokenAuth from "../../middleware/tokenAuthenticate.js";

// @media uploader helper function
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./media");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const uploader = multer({ storage: storage });

router.post("/users", users);

router.post("/account/:user_id", UserTokenAuth, account);

router.post(
  "/store/user",
  uploader.fields([
    { name: "profile", maxCount: 1 },
    { name: "photos", maxCount: 5 },
  ]),
  register
);

// @auth routes
router.put("/update/:userid", UserTokenAuth, update);


export default router;

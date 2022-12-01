import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();


import {
  register,
  login,
  reset,
  update,
  users,
  destroy,
  logout
} from "../controller/authController.js";

// middlwares auth token
import UserTokenAuth from '../middleware/tokenAuthenticate.js'


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

router.get("/users", users);

router.post(
  "/register",
  uploader.fields([
    { name: "profile", maxCount: 1 },
    { name: "photos", maxCount: 5 },
  ]),
  register
);

router.post("/login", login);

// @auth routes
router.post("/logout", UserTokenAuth, logout);
router.delete("/delete/:find",UserTokenAuth, destroy);
router.put("/update/:id",UserTokenAuth, update);

router.post("/reset", reset);

export default router;

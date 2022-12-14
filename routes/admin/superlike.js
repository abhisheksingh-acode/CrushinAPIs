import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();

import {
  transactions,
  history,
  transactionsAdmin
} from "../../controller/superLikeController.js";

// middlwares auth token
import UserTokenAuth from "../../middleware/tokenAuthenticate.js";

router.post("/superlikes/", UserTokenAuth, transactionsAdmin);
router.post("/superlikes/:user_id", UserTokenAuth, history);


export default router;

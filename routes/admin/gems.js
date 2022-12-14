import express from "express";
const router = express.Router();

// middlwares auth token
import UserTokenAuth from "../../middleware/tokenAuthenticate.js";

import { detail, history, transactionsAdmin } from "../../controller/gemController.js";

router.post("/gems", UserTokenAuth, transactionsAdmin);
router.post("/gems/:user_id/user", UserTokenAuth, history);
router.post("/gems/:id/detail", UserTokenAuth, detail);

export default router;

import express from "express";
const router = express.Router();

// middlwares auth token
import UserTokenAuth from "../../middleware/tokenAuthenticate.js";

import { available, credit, debit, history } from "../../controller/gemController.js";

router.post("/gems/:user_id/available", UserTokenAuth, available);
router.post("/gems/:user_id/history", UserTokenAuth, history);
router.post("/gems/:user_id/credit", UserTokenAuth, credit);
router.post("/gems/:user_id/debit", UserTokenAuth, debit);

export default router;

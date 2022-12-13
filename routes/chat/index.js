import express from "express";

const router = express.Router();

import { chats, connect, post, destroy } from "../../controller/chatController.js";

import AuthToken from "../../middleware/tokenAuthenticate.js";

router.post("/chats/:user_id", AuthToken, chats);

router.post("/chat/:chat_id/connect", AuthToken, connect);

router.post("/chat/:user_id/send/:profile_id", AuthToken, post);
router.post("/chats/:id", AuthToken, destroy);

export default router;

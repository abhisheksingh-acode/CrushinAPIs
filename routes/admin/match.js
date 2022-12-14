import express from "express";

const router = express.Router();

import Like from "../../models/Like.js";

import UserTokenAuth from "../../middleware/tokenAuthenticate.js";
import { StatusCodes } from "http-status-codes";


router.post("/matches", UserTokenAuth,async (req, res) => {

     const data = await Like.find().where('accept',true).sort('-_id').populate({path:"user_id", select:"name _id"}).populate({path: "profile_id", select: "name _id"});

     res.status(StatusCodes.OK).json(data);
})



export default router;
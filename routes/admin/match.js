import express from "express";

const router = express.Router();

import Like from "../../models/Like.js";

import UserTokenAuth from "../../middleware/tokenAuthenticate.js";
import { StatusCodes } from "http-status-codes";


router.post("/matches", UserTokenAuth,async (req, res) => {

     const data = await Like.find().where('accept',true).sort('-_id').exec();

     res.status(StatusCodes.OK).json(data);
})



export default router;
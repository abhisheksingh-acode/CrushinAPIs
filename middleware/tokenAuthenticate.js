import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import Dotenv from 'dotenv';

Dotenv.config();

const verifyToken = (req, res, next) => {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];

   if (!token) {
     return res.status(StatusCodes.UNAUTHORIZED).send({
       message: "Access denied: you're not logged in."
     });
   }
 
   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
     if (err) {
       res.status(StatusCodes.BAD_REQUEST).json({
         ...err
       });
     }
     req.userId = decoded.id;
     next();
   });
 };


 export default verifyToken;
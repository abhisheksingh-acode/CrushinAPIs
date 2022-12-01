import cors from 'cors';
import express from "express";
const app = express();

/* process env allowed */
import dotenv from 'dotenv';
dotenv.config();

import 'express-async-errors';

/* import middlewares */
import notFound from "./middleware/notFound.js";
import errorHandlerMiddleware from './middleware/error-handler.js';

/* import routes */
import authRouter from './routes/auth.js';
import mongoose from 'mongoose';

app.use(cors());
app.use(express.json());

 


app.get('/',(req,res)=>{
   res.json({msg:'welcome'});
});


app.get('/home',(req,res)=>{
   res.json({msg:'home'});
});

app.use('/api/',authRouter);


app.use(notFound);
app.use(errorHandlerMiddleware);



const start = async () => {
   try {
      await mongoose.connect(process.env.DB_URL,{
         useUnifiedTopology:true,
         useNewUrlParser: true,
      });

      const port = process.env.port||5000; 
      const urlHost = process.env.APP_URL; 

      app.listen(port,() => (console.log(`server is listening at ${urlHost}`)));
   } catch (error) {
      console.log(error);  
   }
}


start();


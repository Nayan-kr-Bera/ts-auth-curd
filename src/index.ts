import express, { Express, Request, Response } from "express";
import {config}  from "./config/config";
import createHttpError from "http-errors";
import globalErrorHandeler  from "./middleware/globalErrorHandelar";
import userRouter from "./routers/users/user.Router";
import productRouter from "./routers/product/product.router";
import connectDB from "./db/db";
import cors from "cors";

//middleware express
const app: Express = express();
app.use(express.json());
app.use(cors());

//for server start
const PORT = config.port || 8000;

app.listen(PORT, async() => {
  console.log(`Server is running at PORT ${PORT}`);
  await connectDB();
});

// for home page route
app.get("/", (req: Request, res: Response) => {

  const error = createHttpError(400,"something went wrong");
  throw error;
   
});



//main routes
app.use('/api/users',userRouter);
app.use('/api/products',productRouter);




//global error handler
app.use(globalErrorHandeler.errohandeler);
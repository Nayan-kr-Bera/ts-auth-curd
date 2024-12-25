import  { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import {config} from "../config/config";





const globalErrorHandeler = {
    
    errohandeler (err: HttpError,_req: Request, res: Response, _next: NextFunction ) {
   
       const statusCode = err.status || 500;
       const message = err.message || "Something went wrong";
         res.status(statusCode).json({ 
         message: message,
         errorStack:config.env === "development" ? err.stack : " "
      });    
     }

  };
  

  export default globalErrorHandeler;
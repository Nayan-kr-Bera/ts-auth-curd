import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import  { verify } from "jsonwebtoken";
import { config } from "../config/config";
//interface for get request id 
export interface authRequest extends Request{
    userId:string; 
    _id:string;
 }


const authenticate =(req:Request,res:Response,next:NextFunction)=>{
    const token= req.headers.authorization;
    if(!token){ 
        return next(createHttpError(401,"Unauthorized"));
}

try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
    // console.log(token);
    if (!token) {
       next(createHttpError(401,"Unauthorized"));
    }
    const parsedToken=token.split(" ")[1];

    const decodedToken=verify(parsedToken, config.accesstoken as string);
    //from interface
   const request = req as authRequest;
    ///use interface
    request.userId= decodedToken as string;
    request._id=(decodedToken as any)?._id;
    next();
} catch (err) {
    return next(createHttpError(401,"Token expired"));
}




// if(!parsedToken){
//     return next(createHttpError(401,"Unauthorized"));
// }

}
export default authenticate
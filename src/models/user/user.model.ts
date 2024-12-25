import mongoose from "mongoose";
import  {User}  from "../../types/userTypes";
import jWt from "jsonwebtoken";
// import {Request,Response,NextFunction} from "express";
import createHttpError from "http-errors";
import { config } from "../../config/config";

const UserSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});





//Users
export default mongoose.model<User>("User", UserSchema);

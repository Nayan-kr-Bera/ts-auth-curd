import { Document } from "mongoose";

import{User} from "./userTypes";

export interface Product extends Document {
    _id: string;
    userid:String;
    name:string;
    price: string;
    description: string;
    quantity: String;
    image: any;
}
import mongoose from "mongoose";
import  {Product}  from "../../types/productTypes";

const ProductSchema = new mongoose.Schema<Product>({
    userid:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
            type:String,
            required:true
        }
},{timestamps:true});



//Users

export default mongoose.model<Product>("Product", ProductSchema);
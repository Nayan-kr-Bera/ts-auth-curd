import { Request, Response,NextFunction} from "express";
import  Product  from "../../models/product/product.model";
import { uploadOnCloudnary , destroyOnCloudnary} from '../../utils/cloudinary';
import createHttpError from "http-errors";
import  fs from 'fs'; 
import { authRequest } from "../../middleware/auth";

const ProductController = {

    
  async getAllproduct(req: Request, res: Response, next:NextFunction)  {
    try {
      // Fetch all products from the database
      const products = await Product.find();

      // Return products with a success status
        res.status(200).json({
        success: true,
        data: products,
        message: "Products fetched successfully.",
      });
    } catch (err) {
          // Handle the error with a generic message and log the actual error
        const error = createHttpError(400,"Failed to fetch products. Please try again later.");
      return next(error);

    }
  },

 async  getproduct(req: Request, res: Response , next:NextFunction) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
   
     res.status(200).json({
        success: true,
        data: product,
        message: "Products fetched successfully.",
      });
    } catch (error) {
     return next(createHttpError(400,"Failed to get products. Please try again later."));
      
    }

  },

  async createproduct(req: Request, res: Response , next:NextFunction) {
    try {
      const {name, price, description, quantity} = req.body;

    // Define the file object from req.file
   let cloudnaryResponse;
    if (req?.file?.path) {
   
        cloudnaryResponse = await uploadOnCloudnary(req?.file?.path || "");
        
        if (!cloudnaryResponse) {
             res.status(404).json({ message: 'Product image is required' });
        }
        // console.log("File info:", req.file);
         // Delete the local file after successful upload
         fs.unlinkSync(req.file.path);

        }
  

     const request = req as authRequest;

    //  console.log("request.userId",request._id);
     
      const product = new Product({
        userid:request._id,
        name,
        price,
        description,
        quantity,
        image: cloudnaryResponse?.url || '',
      });

      await product.save();

        res.status(201).json({ massage: "product added successfully", data: product });
    } catch (err) {
      return next(createHttpError(400,"Failed to add product. Please try again later.",err));
    }
  },
    
  async updateproduct(req:Request,res:Response, next:NextFunction){
    
    const {id} = req.params;
    const {name,price,description,quantity} = req.body;

    const product = await Product.findById(id);
    
    if (!id) {
      return next(createHttpError(403, "Product id is required"));
  }

          try {
              
              let cloudnaryResponse;
              if (req?.file?.path) {
                 if(product?.image){
                     const cloudinaryImageUrl = product?.image;
                     const urlArray = cloudinaryImageUrl.split('/');
                     const url = urlArray[urlArray.length - 1];
                     const imgName = url.split('.')[0];
                     const cloudinaryDestroyResponse = await destroyOnCloudnary(
                         imgName,
                     );
                     if (!cloudinaryDestroyResponse) {
                         return next(createHttpError(404, "Message:image is not Found"));
                     }

                    }
                  cloudnaryResponse = await uploadOnCloudnary(req?.file?.path || "");
                  // Delete the local file after successful upload
                  fs.unlinkSync(req.file.path);

                  if (!cloudnaryResponse) {
                      return next(createHttpError(404, "Message:image is required"));
                  }
                   
                 
              }
              // const request = req as authRequest;
              if(product){
                  product.name = name;
                  product.price = price;
                  product.description = description;
                  product.quantity = quantity;
                  product.image = cloudnaryResponse?.url || product.image;
                  await product.save();
                 res.status(200).json({massage:"product updated successfully",data:product});
              }
          } catch (err) {
            return next(createHttpError(400,"Failed to update product. Please try again later."));
          }
},

      async deleteproduct(req:Request,res:Response, next:NextFunction) {
          try {
              const {id} = req.params;
              await Product.findByIdAndDelete({_id: id});
              await destroyOnCloudnary(id);
               res.status(200).json({massage:"product deleted successfully"});
          } catch (err) {
            console.log(err);
            return next(createHttpError(404,"Failed to delete product. Please try again later."));
          }
      }
};

export default ProductController;

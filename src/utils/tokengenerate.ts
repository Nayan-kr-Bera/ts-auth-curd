
    import jwt from "jsonwebtoken";
    import createHttpError from "http-errors";
    import user from "../models/user/user.model";
    // import { Request, Response, NextFunction } from "express";
    import { config } from "../config/config";

    const tokengenerate={
    async generateTokens (userId: string): Promise<{ accessToken: string; refreshToken: string }>  {
      // Fetch the user by ID
      const User = await user.findById(userId);
      try {
        // Fetch the user by ID
       
  
        if (!User) {
          const error = createHttpError(404, "User not found");
         throw error;
        }
  
        // Generate access token
        const accessToken = jwt.sign(
          {
            _id: User._id,
            email: User.email,
            name: User.name,
          },
          config.accesstoken,
          {
            expiresIn: config.accessexpiry,
          }
        );
  
        // Generate refresh token
        const refreshToken = jwt.sign(
          {
            _id: User._id,
          },
          config.refreshtoken,
          {
            expiresIn: config.refreshexpiry,
          }
        );
  
        // Update user with the refresh token
        User.refreshToken = refreshToken;
        await User.save();
  
        // Rreturn with tokens
     return({ accessToken, refreshToken });
        
      } catch (error) {
        // Handle errors
        const err = createHttpError(500, "Error generating tokens");
        throw err;
      }
    }
}
export default tokengenerate

// const tokengenerate = {
//   // Middleware-style function with req, res, and next
//   async generateTokens(req: Request, res: Response, next: NextFunction) {
//     const { id } = req.params; // Get user ID from request parameters

//     try {
//       // Fetch the user by ID
//       const User = await user.findById(id);

//       if (!User) {
//         const error = createHttpError(404, "User not found");
//         return next(error); // Pass error to the next middleware
//       }

//       // Generate access token
//       const accessToken = jwt.sign(
//         {
//           _id: User._id,
//           email: User.email,
//           name: User.name,
//         },
//         config.accesstoken,
//         {
//           expiresIn: config.accessexpiry,
//         }
//       );

//       // Generate refresh token
//       const refreshToken = jwt.sign(
//         {
//           _id: User._id,
//         },
//         config.refreshtoken,
//         {
//           expiresIn: config.refreshexpiry,
//         }
//       );

//       // Update user with the refresh token
//       User.refreshToken = refreshToken;
//       await User.save();

//       // Send the tokens as the response
//       res.status(200).send({ accessToken, refreshToken });
//     } catch (error) {
//       // Handle errors
//       const err = createHttpError(500, "Error generating tokens");
//       return next(err); // Pass error to the next middleware
//     }
//   },
// };

// export default tokengenerate;
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import user  from "../../models/user/user.model";
import bcrypt from "bcrypt";

import { User } from "../../types/userTypes";
import  tokengenerate from "../../utils/tokengenerate";



const UserController = {

  async RegisterUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;
    //validation
    if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are  required");
      return next(error);
    }

    //databse call
    try {
      const User = await user.findOne({ email });
      if (User) {
        const error = createHttpError(
          409,
          "user already exist with this email"
        );
        return next(error);
      }
    } catch (err) {
      const error = createHttpError(
        400,
        "error:while getting user from database"
      );
      return next(error);
    }

    //process
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: User;

    try {
      newUser = await user.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(200).send({ massage: "user created", data: newUser });
    } catch (err) {
      const error = createHttpError(400, "error:while creating user");
      return next(error);
    }

   
    const createdUser = await user.findById(newUser._id).select(
      "-password -refreshToken"
  )

  if (!createdUser) {
      next(createHttpError(500, "Something went wrong while registering the user"))
  }
  },

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = createHttpError(400, "eamil and password are required");
      return next(error);
    }
    const User = await user.findOne({ email });
    if (!User) {
      const error = createHttpError(404, "user not found");
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      const error = createHttpError(401, "Invalid credentials");
      return next(error);
    }
  
    const {accessToken, refreshToken} = await tokengenerate.generateTokens(User.id)

    const loggedInUser = await user.findById(User._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json({massege:"login succsefully",data:loggedInUser,accessToken,refreshToken})
    
    // const token = sign({sub:User._id,},config.jwtsecret as string,{expiresIn:"1d"});
    // res.status(200).json({massege:"login succsefully",
    //     accessToken:token});

    // if(!token){
    //     const error = createHttpError(401,"Invalid credentials");
    //     return next(error);
    // }
  },
  async logout(req: Request, res: Response, next: NextFunction){
    try {
      const { accessToken, refreshToken } = req.cookies;
  
      // Check for tokens in cookies
      if (!accessToken || !refreshToken) {
        const error = createHttpError(401, "Unauthorized");
        return next(error);
      }
      const { id } = req.params;
  const User = await user.findById(id);
      // Clear the refresh token in the database
      const updatedUser = await user.findOneAndUpdate(
        { _id: User._id }, // Filter by user ID
        { refreshToken: "" },  // Clear the refresh token
        { new: true }          // Return the updated document
      );
  
      if (!updatedUser) {
        const error = createHttpError(404, "User not found");
        return next(error);
      }
  
      // Clear cookies
      res.clearCookie("accessToken", { httpOnly: true, secure: true });
      res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(createHttpError(500, error.message));
    }
  },
  async changepassword(req: Request, res: Response, next: NextFunction) {
    const {password,newPassword} = req.body
    const {id} = req.params
    const User = await user.findById(id)
    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      const error = createHttpError(401, "Invalid credentials");
      return next(error);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    User.password = hashedPassword
    await User.save()
    res.status(200).json({massage:"password changed successfully"})
  },

 

  async getAlluser(req: Request, res: Response, next: NextFunction) {
    try {
      // Fetch all products from the database
      const User = await user.find();

      // Return products with a success status
      res.status(200).json({
        success: true,
        data: User,
        message: "Products fetched successfully.",
      });
    } catch (err) {
      // Handle the error with a generic message and log the actual error
      const error = createHttpError(
        400,
        "Failed to fetch Users. Please try again later."
      );
      return next(error);
    }
  },

  async getuser(req: Request, res: Response, next: NextFunction) {
    try {
      // Fetch all products from the database
      const { id } = req.params;
      const User = await user.findById(id);

      // Return products with a success status
      res.status(200).json({
        success: true,
        data: User,
        message: "Products fetched successfully.",
      });
    } catch (err) {
      // Handle the error with a generic message and log the actual error
      const error = createHttpError(
        400,
        "Failed to fetch User. Please try again later."
      );
      return next(error);
    }
  },
  async deleteuser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await user.findByIdAndDelete({ _id: id });
      res.status(200).json({ massage: "User deleted successfully" });
    } catch (err) {
      console.log(err);
      return next(
        createHttpError(404, "Failed to delete User. Please try again later.")
      );
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const User = await user.findById(id);
    console.log(User.password)
    try {
      if (!id) {
        return next(createHttpError(403, "User id is required"));
      }
      const isMatch = await bcrypt.compare(password,User.password);

      if (!isMatch) {
        const error = createHttpError(401, "Invalid credentials");
        return next(error);
      }
      // const request = req as authRequest;
      if (User) {
        User.name = name;
        User.email = email;
        // User.password= await bcrypt.hash(password, 10);
        await User.save();
        res
          .status(200)
          .json({ massage: "User updated successfully", data: User });
      }
    } catch (err) {
      return next(createHttpError(400, "provide valid password"));
    }
  },
};

export default UserController;



// const generateAccessAndRefereshTokens = async (id) => {
//   try {
//     const User = await user.findById(id);
//     const accessToken =jwt.sign(
//       {
//         _id: User._id,
//         email:User.email,
//         name:User.name

//       },
//       config.accesstoken,
//       {
//           expiresIn:config.accessexpiry
//       }
//   )
//     const refreshToken = jwt.sign(
//       {
//         _id: User._id,
//       },
//       config.refreshtoken,
//       {
//         expiresIn: config.refreshexpiry,
//       }
//     );

//     User.refreshToken = refreshToken;
//     await User.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {}
// };
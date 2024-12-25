import express from "express";
import authenticate from "../../middleware/auth";

import usercontroller from "../../controllers/users/userController";
const userRouter = express.Router();
//routes
userRouter.get("/users", usercontroller.getAlluser);
userRouter.get("/user/:id", usercontroller.getuser);
// userRouter.post("/login", usercontroller.loginUser);
userRouter.post("/login", usercontroller.loginUser);
userRouter.post("/register",usercontroller.RegisterUser);
userRouter.put("/user/:id", authenticate, usercontroller.updateUser);
userRouter.delete("/user/:id", usercontroller.deleteuser);
userRouter.post("/logout", authenticate, usercontroller.logout);
userRouter.post("/changepassword", authenticate, usercontroller.changepassword);

export default userRouter;

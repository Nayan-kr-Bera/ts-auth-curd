import express from "express";

import productcontroller from "../../controllers/products/prodcutControllers";
import upload from "../../middleware/multer";
import authenticate from "../../middleware/auth";
const productRouter = express.Router();
//routes
productRouter.get("/product", productcontroller.getAllproduct);
productRouter.get("/product/:id", productcontroller.getproduct);
productRouter.post("/create",authenticate, upload.single("image"), productcontroller.createproduct);
productRouter.put("/update/:id",upload.single("image"), productcontroller.updateproduct);
productRouter.delete("/delete/:id", productcontroller.deleteproduct);

export default productRouter;

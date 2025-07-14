import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
const proudctRouter = express.Router();
import upload from "../middlewares/multer";

proudctRouter.get("/Products", getAllProducts);
proudctRouter.post("/Products", upload.single("image"), createProduct);
proudctRouter.put("/Products/:id", upload.single("image"), updateProduct);
proudctRouter.delete("/Products/:id", deleteProduct);

export default proudctRouter;

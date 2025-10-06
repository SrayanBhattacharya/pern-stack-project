import express from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productController.js";

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", getAllProducts);

// CREATE A PRODUCT
router.post("/", createProduct);

export default router;

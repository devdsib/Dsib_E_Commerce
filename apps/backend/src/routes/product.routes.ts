import { Router } from "express";
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";

const router = Router();

// Public Routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin Routes (To be protected by auth middleware)
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export { router as productRouter };

import { Router } from "express";
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// Public Routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin Routes — Protected by JWT + ADMIN role
router.post("/", authenticate, authorize(["ADMIN"]), createProduct);
router.patch("/:id", authenticate, authorize(["ADMIN"]), updateProduct);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteProduct);

export { router as productRouter };

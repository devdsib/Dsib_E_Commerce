import { Router } from "express";
import { createOrder, getMyOrders, handleWebhook, verifyPayment } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createOrder);
router.get("/me", authenticate, getMyOrders);
router.post("/webhook", handleWebhook);
router.post("/verify", authenticate, verifyPayment);

export { router as orderRouter };

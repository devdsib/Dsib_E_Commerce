import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.routes";
import { productRouter } from "./routes/product.routes";
import { orderRouter } from "./routes/order.routes";
import { categoryRouter } from "./routes/category.routes";
import leadRouter from "./routes/lead.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

// ── Startup Environment Validation ──
const REQUIRED_SECRETS = ["JWT_SECRET", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"];
const missingSecrets = REQUIRED_SECRETS.filter((key) => !process.env[key]);

if (missingSecrets.length > 0) {
  const message = `⚠️  Missing required environment variables: ${missingSecrets.join(", ")}`;
  if (process.env.NODE_ENV === "production") {
    console.error(`🚨 FATAL: ${message}`);
    console.error("Server cannot start in production without these secrets. Aborting.");
    process.exit(1);
  } else {
    console.warn(`${message}\n   → Running in development mode with defaults. Set these in your .env file.`);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ──
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ── Body Parsers ──
app.use(express.json({ 
  limit: "10mb",
  verify: (req: any, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging ──
app.use(morgan("dev"));

// ── Health Check ──
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), version: "1.0.0" });
});

// ── API Routes ──
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/leads", leadRouter);

// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ──
app.use(errorHandler);

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`🚀 DSIB Tech API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

export default app;

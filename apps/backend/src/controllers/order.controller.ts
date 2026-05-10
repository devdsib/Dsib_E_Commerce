import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import Razorpay from "razorpay";
import { AuthRequest } from "../middleware/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test",
});

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items, shippingAddressId, paymentMethod } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Calculate totals
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      // Find by slug (matches mockData cart) OR by id (for DB-sourced items)
      const product = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: item.productId },
            { id: item.productId },
            { sku: item.productId },
          ]
        }
      });
      if (!product) throw new Error(`Product "${item.productId}" not found in database. Please run the seed script.`);
      
      const price = product.discountPrice ?? product.price;
      subtotal += Number(price) * item.quantity;
      
      orderItemsData.push({
        productId: product.id, // Always use real DB UUID
        quantity: item.quantity,
        price: Number(price),
      });
    }

    const taxAmount = subtotal * 0.18;
    const shippingAmount = subtotal > 499 ? 0 : 49;
    const totalAmount = subtotal + taxAmount + shippingAmount;

    // Handle Mock Address for Demo
    let finalAddressId = shippingAddressId;
    if (shippingAddressId === "mock-address-id") {
      const existingAddress = await prisma.address.findFirst({ where: { userId } });
      if (existingAddress) {
        finalAddressId = existingAddress.id;
      } else {
        const newAddress = await prisma.address.create({
          data: {
            userId,
            street: "Mock Street",
            city: "Mock City",
            state: "Mock State",
            postalCode: "123456",
          }
        });
        finalAddressId = newAddress.id;
      }
    }

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        userId,
        shippingAddressId: finalAddressId,
        totalAmount,
        taxAmount,
        shippingAmount,
        paymentMethod,
        items: {
          create: orderItemsData
        }
      },
      include: { items: true }
    });

    // If Razorpay, generate Razorpay Order ID
    if (paymentMethod === "RAZORPAY") {
      const options = {
        amount: Math.round(totalAmount * 100), // In paise
        currency: "INR",
        receipt: order.id,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id }
      });

      return res.status(201).json({ order, razorpayOrder });
    }

    res.status(201).json({ order });
  } catch (error: any) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user?.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "dsib_webhook_secret_123";
    const signature = req.headers["x-razorpay-signature"] as string;

    const isValid = Razorpay.validateWebhookSignature(
      (req as any).rawBody,
      signature,
      secret
    );

    if (!isValid) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "order.paid" || event === "payment.captured") {
      const razorpayOrderId = event === "order.paid"
        ? payload.order.entity.id
        : payload.payment.entity.order_id;

      await prisma.order.updateMany({
        where: { razorpayOrderId },
        data: {
          paymentStatus: "COMPLETED",
          orderStatus: "CONFIRMED",
        }
      });

      console.log(`✅ Payment confirmed via webhook [${event}]: ${razorpayOrderId}`);
    }

    if (event === "payment.failed") {
      const razorpayOrderId = payload.payment.entity.order_id;

      await prisma.order.updateMany({
        where: { razorpayOrderId },
        data: { paymentStatus: "FAILED" }
      });

      console.log(`❌ Payment failed: ${razorpayOrderId}`);
    }

    res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};

// Client-side payment verification (called after Razorpay modal success)
export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const isValid = Razorpay.validateWebhookSignature(
      body,
      razorpaySignature,
      process.env.RAZORPAY_KEY_SECRET || "test"
    );

    if (!isValid) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Update order status
    const order = await prisma.order.updateMany({
      where: { razorpayOrderId },
      data: {
        paymentStatus: "COMPLETED",
        orderStatus: "CONFIRMED",
      }
    });

    res.json({ success: true, message: "Payment verified successfully", order });
  } catch (error) {
    next(error);
  }
};

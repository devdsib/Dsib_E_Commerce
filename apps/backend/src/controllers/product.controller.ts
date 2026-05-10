import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, brand, minPrice, maxPrice, sortBy, featured } = req.query;

    const where: any = {};
    
    if (category) {
      where.category = { slug: category as string };
    }
    
    if (brand) {
      where.brand = brand as string;
    }
    
    if (minPrice || maxPrice) {
      where.price = {
        gte: minPrice ? parseFloat(minPrice as string) : undefined,
        lte: maxPrice ? parseFloat(maxPrice as string) : undefined,
      };
    }
    
    if (featured === "true") {
      where.isFeatured = true;
    }

    let orderBy: any = { createdAt: "desc" };
    
    if (sortBy === "price-asc") orderBy = { price: "asc" };
    if (sortBy === "price-desc") orderBy = { price: "desc" };
    if (sortBy === "newest") orderBy = { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { reviews: true }
        }
      },
      orderBy,
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: { select: { reviews: true } }
      }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    // Auto-generate slug if missing
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    // Ensure slug is unique — append timestamp if needed
    if (body.slug) {
      const existing = await prisma.product.findUnique({ where: { slug: body.slug } });
      if (existing) {
        body.slug = `${body.slug}-${Date.now()}`;
      }
    }

    // Clean payload — only pass known fields
    const data: any = {
      name: body.name,
      slug: body.slug,
      sku: body.sku,
      description: body.description || "",
      price: parseFloat(body.price),
      discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
      stockQuantity: parseInt(body.stockQuantity ?? body.stock ?? 0),
      categoryId: body.categoryId,
      brand: body.brand || null,
      images: Array.isArray(body.images) ? body.images : (body.imageUrl ? [body.imageUrl] : []),
      isFeatured: Boolean(body.isFeatured),
      specifications: body.specifications || {},
      gstPercentage: body.gstPercentage || 18,
    };

    const product = await prisma.product.create({ data });
    res.status(201).json({ product });
  } catch (error: any) {
    // Handle duplicate SKU/slug gracefully
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] || "field";
      return res.status(400).json({ error: `A product with this ${field} already exists. Please use a unique ${field}.` });
    }
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Clean unknown fields
    const allowedFields = ["name", "slug", "sku", "description", "price", "discountPrice", "stockQuantity", "categoryId", "brand", "images", "isFeatured", "specifications", "gstPercentage", "status"];
    const data: any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        data[key] = body[key];
      }
    }

    // Handle images
    if (body.imageUrl && !data.images) {
      data.images = [body.imageUrl];
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    });
    res.json({ product });
  } catch (error: any) {
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] || "field";
      return res.status(400).json({ error: `A product with this ${field} already exists.` });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Verify product exists first
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Use transaction to delete associated records first (cascade delete)
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { productId: id } }),
      prisma.orderItem.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } })
    ]);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

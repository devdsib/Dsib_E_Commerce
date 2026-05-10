import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

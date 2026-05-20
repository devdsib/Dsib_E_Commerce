import { Request, Response, NextFunction } from "express";

// Prisma error code reference
const PRISMA_ERRORS: Record<string, { status: number; message: string }> = {
  P1001: { status: 503, message: "Database is unreachable. Please check if PostgreSQL is running." },
  P1003: { status: 503, message: "Database does not exist. Run 'npx prisma db push' first." },
  P2002: { status: 400, message: "This record already exists (duplicate entry)." },
  P2025: { status: 404, message: "Record not found." },
  P2003: { status: 400, message: "Related record not found (foreign key constraint failed)." },
};

const isProduction = process.env.NODE_ENV === "production";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Always log the full error server-side for debugging
  console.error(`[Error] ${err.code || ""} ${err.message}`);
  if (!isProduction) {
    console.error(err.stack);
  }

  // Handle Prisma client errors
  if (err.code && err.code.startsWith("P")) {
    const prismaError = PRISMA_ERRORS[err.code];
    if (prismaError) {
      return res.status(prismaError.status).json({ error: prismaError.message });
    }
    // Unknown Prisma error — sanitize in production
    if (isProduction) {
      return res.status(500).json({ error: "A database error occurred. Please try again later." });
    }
    return res.status(500).json({ error: `Database error [${err.code}]: ${err.message}` });
  }

  const status = err.status || err.statusCode || 500;

  // In production, never expose raw error messages for 500-level errors
  const message =
    isProduction && status >= 500
      ? "An unexpected error occurred. Please try again later."
      : err.message || "Internal Server Error";

  res.status(status).json({
    error: message,
    // Only include stack traces in development
    ...(!isProduction && { stack: err.stack }),
  });
};

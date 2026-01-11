import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // Prisma errors
  if (err.code === "P2002") {
    return sendError(res, "Duplicate entry. This record already exists.", 409);
  }

  if (err.code === "P2025") {
    return sendError(res, "Record not found.", 404);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return sendError(res, message, statusCode);
};

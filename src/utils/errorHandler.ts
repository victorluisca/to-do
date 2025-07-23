import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Error",
      issues: err.issues,
    });
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON Payload" });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
}

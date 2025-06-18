import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/apiError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: err.message,
      code: err.code,
      status: err.status,
    });
  } else if (err instanceof Error) {
    res.status(500).json({
      error: err.message,
      code: "INTERNAL_ERROR",
      status: 500,
    });
  } else {
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
      status: 500,
    });
  }
}

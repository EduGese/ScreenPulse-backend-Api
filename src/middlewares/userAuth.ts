import { ApiError } from "../errors/apiError";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequest.interface";

export function userAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "No token provided", "AUTH_MISSING_TOKEN"));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { user_id: string };
    req.userId = decoded.user_id;
    next();
  } catch {
    return next(new ApiError(401, "Invalid token", "AUTH_INVALID_TOKEN"));
  }
}

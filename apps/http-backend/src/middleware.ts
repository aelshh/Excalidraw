import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "./config";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"] ?? "";
  const decoded = jwt.verify(token, JWT_TOKEN) as { userId: string };

  if (decoded.userId) {
    req.userId = decoded.userId;
    next();
  } else {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
};

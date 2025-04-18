import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import AppError from "../app/errors/AppError";
import config from "../app/config";

interface DecodedToken {
  email: string;
  role: string;
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new AppError(401, "Token not found");

  try {
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET!) as DecodedToken;
    req.user = decoded;
    next();
  } catch (err) {
    throw new AppError(401,"Invalid token");
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    throw new AppError( 403, "Access denied. You are not an admin.");
  }
  next();
};
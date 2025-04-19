import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../app/config";
import AppError from "../app/errors/AppError";
import { User } from "../app/modules/user/user.model";
import httpStatus from "http-status";
import { TUser } from "../app/modules/user/user.interface";
import catchAsync from "../app/utils/catchAsync";

// interface DecodedToken {
//   _id : string;
//   email: string;
//   role: string;
// }

// export const protect = async (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) throw new AppError(401, "Token not found");

//   try {
//     const decoded = await jwt.verify(token, config.JWT_ACCESS_SECRET!) as JwtPayload;
//     console.log(decoded)
//     const user = await User.findById(decoded._id)
//     if(user){
//     req.user = decoded;
//   }
//     next();
//   } catch (err) {
//     throw new AppError(401,"Invalid token");
//   }
// };

// export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
//   if (req.user?.role !== "admin") {
//     throw new AppError( 403, "Access denied. You are not an admin.");
//   }
//   next();
// };

const authenticateUser = async (req: Request): Promise<{ decoded: JwtPayload; user: TUser }> => {
  const token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }

  // Verify the token
  const decoded = jwt.verify(
    token,
    config.JWT_ACCESS_SECRET as string
  ) as JwtPayload;

  const { email, iat,role,_id } = decoded;

  // Check if the user exists
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is deleted
  if (user?.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is already removed from the system'
    );
  }

  // Return the decoded token
  return { decoded, user };
};

export const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { decoded } = await authenticateUser(req);
    req.user = decoded
    next();
  });
};
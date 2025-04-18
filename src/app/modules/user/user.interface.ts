/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export interface TUser {
    _id : Types.ObjectId;
    userName: string;
    email: string;
    password?: string;
    passwordChangedAt?: Date;
    isDeleted: boolean;
    role: "user" | "admin";
}
export type TLoginUser = {
    email: string;
    password: string;
  };
export interface UserModel extends Model<TUser> {
    isUserExistsByEmail(email: string): Promise<TUser>;
    isOTPVerified(OTP: string, SavedOTP: string,OTPExpiresAt :Date, OTPUsed : boolean) : Promise<boolean>;
    isPasswordMatched(plainTextPassword: string, hashPassword: string): Promise<boolean>;
    isJWTIssuedBeforePasswordChanged(passordChangeTimeStamp: Date, JwtIssuedTimeStamp: number): boolean;
}

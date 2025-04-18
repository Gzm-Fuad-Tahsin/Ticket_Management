import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { TLoginUser, TUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status';
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../utils/sendEmail";
import { generateOTP } from "../../utils/generateOTP";
import { createToken } from "../../utils/authToken";
// import { OAuth2Client } from "google-auth-library";

// const UpdatePassword = async (userID: Types.ObjectId, newPassword: string) => {
//     const newHashedPassword = await bcrypt.hash(
//         newPassword,
//         Number(config.bcrypt_salt_round),
//     );
//     await User.findOneAndUpdate(
//         {
//             _id: userID,
//         },
//         {
//             password: newHashedPassword,
//             needsPasswordChange: false,
//             passwordChangedAt: new Date(),
//         },
//     );
// }

const SignUp = async (payload: TUser) => {
    const isUserExist = await User.isUserExistsByEmail(payload.email);
    if (isUserExist) {
        throw new AppError(httpStatus.CONFLICT, 'User Already exists');
    }

    const userData: Partial<TUser> = {
        email: payload.email,
        userName: payload.userName,
        password: payload.password,
    };

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Create the user
        const user = await User.create([userData], { session });
        if (!user.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }



        await session.commitTransaction();

        // create token and sent to the client

        const jwtPayload = {
            email: user[0].email,
        };
        const accessToken = createToken(
            jwtPayload,
            config.JWT_ACCESS_SECRET as string,
            config.JWT_ACCESS_EXPIRES_IN as string,
        );

        const refreshToken = createToken(
            jwtPayload,
            config.JWT_REFRESH_SECRET as string,
            config.JWT_REFRESH_EXPIRES_IN as string,
        );


        return {
            user: {
                _id: user[0]._id,
                email: user[0].email,
                userName: user[0].userName,
            },
            accessToken,
            refreshToken
        };
    } catch (error) {

        await session.abortTransaction();

        throw new AppError(
            httpStatus.BAD_REQUEST,
            (error as Error).message || 'An unknown error occurred',
            (error as Error)?.stack,
        );
    } finally {

        await session.endSession();
    }
}

const login = async (payload: TLoginUser) => {
    // check if the userExist
    const user = await User.isUserExistsByEmail(payload.email);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // checking if the user is already deleted
    const isDeleted = user.isDeleted;
    if (isDeleted) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'User is already removed from system',
        );
    }
    //checking if the password is correct
    if (user?.password && !(await User.isPasswordMatched(payload.password, user.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password is not correct');
    }


    const jwtPayload = {
        email: user.email
    };
    const accessToken = createToken(
        jwtPayload,
        config.JWT_ACCESS_SECRET as string,
        config.JWT_ACCESS_EXPIRES_IN as string,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.JWT_REFRESH_SECRET as string,
        config.JWT_REFRESH_EXPIRES_IN as string,
    );


    return {
        user: {
            _id: user._id,
            email: user.email,
            userName: user.userName
        },
        accessToken,
        refreshToken
    };


};

// const changePassword = async (
//     userData: JwtPayload,
//     payload: { oldPassword: string; newPassword: string },
// ) => {
//     // check if the userExist
//     const user = await User.isUserExistsByEmail(userData.email);
//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }
//     // checking if the user is already deleted
//     const isDeleted = user?.isDeleted;
//     if (isDeleted) {
//         throw new AppError(
//             httpStatus.FORBIDDEN,
//             'User is already removed from system',
//         );
//     }

//     //checking if the old password is correcttly matched with db password
//     if (user.password && !(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
//         throw new AppError(httpStatus.FORBIDDEN, 'old Password is not correct');
//     }

//     await UpdatePassword(user._id, payload.newPassword);
//     return null;
// };

// const getAccessToken = async (token: string) => {

//     if (!token) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthrized access');
//     }

//     const decoded = jwt.verify(
//         token,
//         config.JWT_REFRESH_SECRET as string,
//     ) as JwtPayload;

//     const { email, iat } = decoded;

//     const user = await User.isUserExistsByEmail(email);

//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     // checking if the user is already deleted
//     const isDeleted = user?.isDeleted;
//     if (isDeleted) {
//         throw new AppError(
//             httpStatus.FORBIDDEN,
//             'User is already removed from system',
//         );
//     }


//     //check if the token is generated before the  password has changed
//     if (
//         user?.passwordChangedAt &&
//         User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
//     ) {
//         throw new AppError(
//             httpStatus.FORBIDDEN,
//             'You are not authorized. Log in Again',
//         );
//     }


//     const jwtPayload = {
//         email: user.email,
//         rootFolder: user.rootFolderID
//     };
//     const accessToken = createToken(
//         jwtPayload,
//         config.JWT_ACCESS_SECRET as string,
//         config.JWT_ACCESS_EXPIRES_IN as string,
//     );

//     return {
//         accessToken,
//     };
// };

// const forgetPassword = async (email: string) => {
//     const user = await User.isUserExistsByEmail(email);

//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     // checking if the user is already deleted
//     const isDeleted = user?.isDeleted;
//     if (isDeleted) {
//         throw new AppError(
//             httpStatus.FORBIDDEN,
//             'User is already removed from system',
//         );
//     }

//     const currentTime = new Date();
//     const OTPExpiresAt = user.verificationInfo?.OTPExpiresAt;

//     if (OTPExpiresAt && currentTime < OTPExpiresAt) {
//         throw new AppError(
//             httpStatus.FORBIDDEN,
//             'OTP already generated recently',
//         );
//     }

//     const OTP = generateOTP(6);

//     const newOTPExpiresAt = new Date();
//     newOTPExpiresAt.setMinutes(newOTPExpiresAt.getMinutes() + 5);

//     const updatedUser = await User.updateOne(
//         { email: user.email },
//         {
//             $set: {
//                 'verificationInfo.OTP': OTP,
//                 'verificationInfo.OTPExpiresAt': newOTPExpiresAt,
//                 'verificationInfo.OTPUsed': false,
//             },
//         }
//     );

//     if (updatedUser.modifiedCount === 0) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update OTP');
//     }

//     //send otp to the email of the user
//     const OTPmail = `Your OTP for changing password is ${OTP}. Please verify in 5 minutes`;

//     await sendEmail(user.email, OTPmail);

//     return null;
// };

// const verifyOTP = async (email: string, OTP: string) => {

//     const user = await User.isUserExistsByEmail(email);

//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     // checking if the user is already deleted
//     const isDeleted = user?.isDeleted;
//     if (isDeleted) {
//         throw new AppError(
//             httpStatus.FORBIDDEN,
//             'User is already removed from system',
//         );
//     }

//     if (!User.isOTPVerified(
//         OTP,
//         user?.verificationInfo?.OTP,
//         user?.verificationInfo?.OTPExpiresAt,
//         user?.verificationInfo?.OTPUsed,
//     )) {
//         throw new AppError(
//             httpStatus.FORBIDDEN,
//             'OTP verification failed',
//         );
//     }

//     const jwtPayload = {
//         email: user.email
//     };
//     const token = createVerifyUserToken(
//         jwtPayload,
//         config.JWT_VERIFIED_USER_SECRET as string,
//         '60m',
//     );
//     return {
//         token,

//     }
// }

// const resetPassword = async (token: string, password: string) => {

//     if (!token) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthrized');
//     }

//     const decoded = jwt.verify(
//         token,
//         config.JWT_VERIFIED_USER_SECRET as string,
//     ) as JwtPayload;

//     const { email } = decoded;

//     const user = await User.isUserExistsByEmail(email);

//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     // checking if the user is already deleted
//     const isDeleted = user?.isDeleted;
//     if (isDeleted) {
//         throw new AppError(
//             httpStatus.FORBIDDEN,
//             'User is already removed from system',
//         );
//     }
//     await UpdatePassword(user._id, password);

//     const updateResult = await User.updateOne(
//         { _id: user._id },
//         {
//             $unset: { verificationInfo: 1 },
//         }
//     );

//     if (!updateResult.matchedCount || !updateResult.modifiedCount) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Failed to remove verification information');
//     }

//     return null;

// };

export const UserServices = {
    SignUp,
    login,
    // googleAuth,
    // changePassword,
    // getAccessToken,
    // forgetPassword,
    // verifyOTP,
    // resetPassword,
}
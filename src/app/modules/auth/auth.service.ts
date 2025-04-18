import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { createToken } from "../../utils/authToken";
import { TLoginUser, TUser } from "../user/user.interface";
import mongoose from "mongoose";
import { User } from "../user/user.model";

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
            role: user[0].role,
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
                userName: user[0].userName
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
            userName: user.userName,
        },
        accessToken,
        refreshToken
    };


};

export const AuthServices = {
    SignUp,
    login,
}
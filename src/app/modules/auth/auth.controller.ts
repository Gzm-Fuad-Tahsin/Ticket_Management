import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

export const LoginUserByEmailandPassword = catchAsync(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthServices.login(req.body);

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User Logged in successfully',
        data: { accessToken, user },
    });
})


export const signUpUserByEmailandPassword = catchAsync(async (req, res) => {
    const { refreshToken, accessToken, user } = await AuthServices.SignUp(req.body);

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is created in successfully',
        data: { accessToken, user },
    });
})
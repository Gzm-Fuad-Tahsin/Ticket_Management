"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const user_validator_1 = require("../user/user.validator");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const authToken_1 = require("../../utils/authToken");
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validCredentials = yield (0, user_validator_1.validateFormLogin)(email, password);
    if (validCredentials.email && validCredentials.password) {
        // res.status(404).send({error:validCredentials})
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Email and Password is required");
    }
    else if (validCredentials.email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "provide valid email");
    }
    else if (validCredentials.password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "provide password");
    }
    try {
        const user = yield user_model_1.User.findOne({ email: email, isDeleted: false }).exec();
        if (!user) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User Not Found");
        }
        if ((_a = user === null || user === void 0 ? void 0 : user.otp) === null || _a === void 0 ? void 0 : _a.isVerified) {
            if (!user.isActive) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are temporarily banned");
            }
            const isPassword = yield user_model_1.User.isPasswordMatch(password, user.password);
            if (isPassword) {
                const JwtPayload = {
                    _id: user === null || user === void 0 ? void 0 : user._id,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    role: user === null || user === void 0 ? void 0 : user.role,
                };
                const accessToken = (0, authToken_1.createToken)(JwtPayload, "jlk", 111212);
                const refreshToken = (0, authToken_1.createToken)(JwtPayload, "jlk", 111212);
                return { accessToken, refreshToken };
                // sendResponse(res, {
                //     statusCode: httpStatus.OK,
                //     success: true,
                //     message: 'login successful',
                //     data: {token: `Bearer ${token}`},
                //   })
            }
            else {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
            }
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "OTP not verified");
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal Server Error");
    }
});
exports.loginUser = loginUser;

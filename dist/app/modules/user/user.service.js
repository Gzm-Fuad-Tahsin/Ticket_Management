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
exports.deleteUserFromDB = exports.updateUserRoleFromDB = exports.getAllUserFromDB = exports.getSingleUserFromDB = exports.createUserIntoDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const mongodb_1 = require("mongodb");
const authToken_1 = require("../../utils/authToken");
const generateOTP_1 = require("../../utils/generateOTP");
const user_model_1 = require("./user.model");
const user_validator_1 = require("./user.validator");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createUserIntoDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the registration form input (name, email, password)
        const register = yield (0, user_validator_1.validateFormRegister)(user.name, user.email, user.password);
        // If validation fails, return the errors (commented out as per your original code)
        if (register.name || register.email || register.password) {
            return {
                success: false,
                message: "Invalid form data",
                data: register,
            };
        }
        // Check if the user already exists by email
        const check_user = yield user_model_1.User.isUserExistsByEmail(user.email);
        // If the user exists and OTP is verified, throw a conflict error (email already exists)
        if (check_user && check_user.otp.isVerified) {
            return {
                success: false,
                message: 'Email already exists',
                statusCode: 409, // HTTP Conflict
            };
        }
        // Generate OTP for new user or unverified users
        const otp = yield (0, generateOTP_1.generateOTP)();
        const JwtPayload = {
            email: user.email,
            otp: otp,
        };
        // Create a token with the OTP and email
        const otp_token = (0, authToken_1.createToken)(JwtPayload, "your_jwt_secret_key", "1h");
        // Find the user by email to update OTP or save a new user
        const existingUser = yield user_model_1.User.findOne({ email: user.email });
        if (existingUser && !existingUser.otp.isVerified) {
            // If user exists and OTP is not verified, update OTP in the database
            yield existingUser.updateOne({ $set: { otp: { token: otp_token, isVerified: false } } });
            return {
                success: true,
                isOtpSend: true,
                email: existingUser.email,
                message: 'OTP sent, please verify your email.',
            };
        }
        else {
            // Save the new user into the database
            const newUser = new user_model_1.User({
                name: user.name,
                email: user.email,
                password: user.password,
                otp: { token: otp_token, isVerified: false },
            });
            const savedUser = yield newUser.save();
            if (savedUser) {
                return {
                    success: true,
                    isOtpSend: true,
                    email: savedUser.email,
                    message: 'New user created and OTP sent.',
                };
            }
            else {
                return {
                    success: false,
                    message: "Error saving new user",
                    statusCode: 500, // Internal Server Error
                };
            }
        }
    }
    catch (error) {
        console.error("Error in createUserIntoDB:", error);
        //   return {
        //     success: false,
        //     message: "An error occurred during registration",
        //     error: error.message,
        //     statusCode: 500,
        //   };
    }
});
exports.createUserIntoDB = createUserIntoDB;
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Id is required");
        }
        if (id) {
            const user = yield user_model_1.User.findOne({ _id: new mongodb_1.ObjectId(id) })
                .populate("addedProducts")
                .select("-password");
            return user;
        }
    }
    catch (error) {
        console.error("Error in getSingleUserFromDB:", error);
    }
});
exports.getSingleUserFromDB = getSingleUserFromDB;
// TODO : ADD .search method
const getAllUserFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query).paginate()
            .filter()
            .sort();
        const users = yield userQuery.modelQuery;
        return users;
    }
    catch (error) {
        console.error("Error in getAllUserFromDB:", error);
    }
});
exports.getAllUserFromDB = getAllUserFromDB;
const updateUserRoleFromDB = (id, email, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Id is required");
        }
        if (id) {
            const check_user = yield user_model_1.User.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!check_user) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
            }
            const user = yield user_model_1.User.findByIdAndUpdate(check_user === null || check_user === void 0 ? void 0 : check_user._id, { role }, { new: true });
            return user;
        }
    }
    catch (error) {
        console.error("Error in updateUserFromDB:", error);
    }
});
exports.updateUserRoleFromDB = updateUserRoleFromDB;
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Id is required");
        }
        if (id) {
            const check_user = yield user_model_1.User.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!check_user) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
            }
            const user = yield user_model_1.User.findByIdAndUpdate(check_user === null || check_user === void 0 ? void 0 : check_user._id, { isDeleted: true }, { new: true });
            return user;
        }
    }
    catch (error) {
        console.error("Error in deleteUserFromDB:", error);
    }
});
exports.deleteUserFromDB = deleteUserFromDB;

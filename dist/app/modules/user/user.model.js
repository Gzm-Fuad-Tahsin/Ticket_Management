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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    mobile: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "super-admin"],
        default: "user",
    },
    contactNumber: { type: String },
    profilePicture: { type: String, default: "" },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    birthDate: {
        type: String,
    },
    otp: {
        token: { type: String, default: "" },
        isVerified: { type: Boolean, default: false },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    password_reset_token: {
        type: String,
        default: "",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
// Pre-save hook for hashing passwords
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, 
        // TODO
        Number());
        next();
    });
});
// Post-save hook to clear password from the response
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
// Static method to check if a user exists by email
userSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findOne({ email }).select("+password");
    });
};
// Static method to check if the password matches
userSchema.statics.isPasswordMatch = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
// Export the User model with static methods
exports.User = (0, mongoose_1.model)("User", userSchema);

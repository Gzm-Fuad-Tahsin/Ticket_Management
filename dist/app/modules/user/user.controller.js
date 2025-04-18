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
exports.deleteUser = exports.updateUserRole = exports.getAllUser = exports.getUser = exports.signup = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
// export const signin =  catchAsync(async(req,res) => {
//     try{
//         const {email,password} = req.body;
//         const validCredentials =  await validateFormLogin(email,password);
//         if(validCredentials.email && validCredentials.password){
//             // res.status(404).send({error:validCredentials})
//             sendResponse(res, {
//                 statusCode: httpStatus.NOT_ACCEPTABLE,
//                 success: false,
//                 message: 'provide valid email and password',
//                 data: "",
//               })
//         }else if(validCredentials.email ){
//             sendResponse(res, {
//                 statusCode: httpStatus.NOT_ACCEPTABLE,
//                 success: false,
//                 message: 'provide valid email',
//                 data: "",
//               })
//         }
//         else if(validCredentials.password ){
//             sendResponse(res, {
//                 statusCode: httpStatus.NOT_ACCEPTABLE,
//                 success: false,
//                 message: 'provide password',
//                 data: "",
//               })
//         }
//             const user = await User.findOne({ email:email }).exec();
//             if (!user) {
//               res.status(400).json({ message: 'User not found' });
//             }
//             if (user?.otp?.isVerified) {
//               if (!user.isActive) {
//                 res.status(400).json({ message: 'You are temporarily banned' });
//               }
//               const isPassword = await user.authenticate(password);
//               if (isPassword) {
//                 const token = createToken(user?._id, user?.role, user?.email);
//                 sendResponse(res, {
//                     statusCode: httpStatus.OK,
//                     success: true,
//                     message: 'login successful',
//                     data: {token: `Bearer ${token}`},
//                   })
//               } else {
//                 sendResponse(res, {
//                     statusCode: httpStatus.UNAUTHORIZED,
//                     success: false,
//                     message: 'Invalid credentials',
//                     data: "",
//                   })
//               }
//             } else {
//               sendResponse(res, {
//                 statusCode: httpStatus.UNAUTHORIZED,
//                 success: false,
//                 message: 'OTP not verified',
//                 data: "",
//               })
//             }
//           } 
//     catch (error) {
//         sendResponse(res, {
//             statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//             success: false,
//             message: 'Server Crushed',
//             data: "",
//           })
//       }
// })
exports.signup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const register = await validateFormRegister(name , email, password)
    // if(register.name != ""  || register.email != "" || register.password != ""){
    //   sendResponse(res, {
    //     statusCode: httpStatus.NOT_ACCEPTABLE,
    //     success: false,
    //     message: "invalid",
    //     data: register,
    //   })
    // }
    // try {
    //   const user = await User.isUserExistsByEmail(email)
    //   if(user && user.otp.isVerified){
    //     sendResponse(res, {
    //       statusCode: httpStatus.CONFLICT,
    //       success: false,
    //       message: 'Email already exists',
    //       data: "",
    //   })
    //   }
    //   else{
    //     const otp:string = await generateOTP()
    //     const JwtPayload = {
    //       email: email,
    //       otp : otp
    //     }
    //     const otp_token:string = createToken(JwtPayload, "jlk",111212)
    //   }
    // } catch (error) {
    // }
    try {
        const { name, email, password } = req.body;
        // Call createUserIntoDB with the user data
        const user = {
            name: name,
            email: email,
            password: password
        };
        const result = yield (0, user_service_1.createUserIntoDB)(user);
        // TODO : send mail for OTP and SMS also
        // Check if the registration was successful
        if (result === null || result === void 0 ? void 0 : result.success) {
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: result === null || result === void 0 ? void 0 : result.message,
                data: "",
            });
        }
        else {
            (0, sendResponse_1.default)(res, {
                statusCode: (result === null || result === void 0 ? void 0 : result.statusCode) || http_status_1.default.BAD_REQUEST,
                success: true,
                message: result === null || result === void 0 ? void 0 : result.message,
                data: "",
            });
        }
    }
    catch (error) {
        console.error("Error in /register route:", error);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'Server Crushed',
            data: "",
        });
    }
}));
/*-------------------get single user-------------------- */
exports.getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield (0, user_service_1.getSingleUserFromDB)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "User retrieved success",
        success: true,
        data: result,
    });
}));
/*-----------------get all user-----------------------*/
exports.getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield (0, user_service_1.getAllUserFromDB)(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "All User retrieved success",
        success: true,
        data: result,
    });
}));
/*------------------Update User Role---------------------*/
exports.updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { email, role } = req.body;
    const result = yield (0, user_service_1.updateUserRoleFromDB)(id, email, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Role update successfully",
        success: true,
        data: "",
    });
}));
/*------------------Update User---------------------*/
/*-----------------Delete User----------------------*/
exports.deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield (0, user_service_1.deleteUserFromDB)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "User deleted successfully",
        success: true,
        data: ""
    });
}));

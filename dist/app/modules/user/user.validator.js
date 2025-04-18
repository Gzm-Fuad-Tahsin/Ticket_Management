"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFormRegister = exports.validateFormLogin = void 0;
const validator_1 = __importDefault(require("validator"));
const error = {
    email: "",
    password: ""
};
const errorReg = {
    name: "",
    email: "",
    password: ""
};
const validateFormLogin = (email, password) => {
    if (!email) {
        error.email = 'Please provide your email address';
    }
    else if (!validator_1.default.isEmail(email)) {
        error.email = 'Invalid email address';
    }
    else {
        error.email = "";
    }
    console.log(validator_1.default.isEmail(email));
    if (!password || password.length === 0) {
        error.password = 'Please provide a password';
    }
    return error;
};
exports.validateFormLogin = validateFormLogin;
const validateFormRegister = (name, email, password) => {
    if (!name) {
        errorReg.name = 'Please provide your name';
    }
    if (!email) {
        errorReg.email = 'Please provide your email address';
    }
    else if (!validator_1.default.isEmail(email)) {
        errorReg.email = 'Invalid email address';
    }
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/; // Regex to match special characters
    if (!password) {
        errorReg.password = 'Please provide a password';
    }
    else if (password.length < 6) {
        errorReg.password = 'Password should not be less than six characters';
    }
    else if (!specialCharacterRegex.test(password)) {
        errorReg.password = 'Password must contain at least one special character';
    }
    return errorReg;
};
exports.validateFormRegister = validateFormRegister;

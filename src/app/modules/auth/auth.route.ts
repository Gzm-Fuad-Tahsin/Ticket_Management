import express from "express";
import {  LoginUserByEmailandPassword, signUpUserByEmailandPassword } from "./auth.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { protect } from "../../../middlewares/auth";

const route = express.Router();


route.post("/register",validateRequest(AuthValidation.SignUpByEmailAndPasswordValidationSchema),signUpUserByEmailandPassword);
route.post("/login",validateRequest(AuthValidation.loginValidationSchema),LoginUserByEmailandPassword);




export const AuthRoutes = route;
import express from "express";
import {  LoginUserByEmailandPassword, logout, signUpUserByEmailandPassword } from "./auth.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const route = express.Router();


route.post("/register",validateRequest(AuthValidation.SignUpByEmailAndPasswordValidationSchema),signUpUserByEmailandPassword);
route.post("/login",validateRequest(AuthValidation.loginValidationSchema),LoginUserByEmailandPassword);
route.post("/logout",logout);




export const AuthRoutes = route;
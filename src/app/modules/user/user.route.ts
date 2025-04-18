import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const route = express.Router();


// route.post("/register",validateRequest(UserValidation.SignUpByEmailAndPasswordValidationSchema),signUpUserByEmailandPassword);
// route.post("/login",validateRequest(UserValidation.loginValidationSchema),LoginUserByEmailandPassword);


export const UserRoutes = route;
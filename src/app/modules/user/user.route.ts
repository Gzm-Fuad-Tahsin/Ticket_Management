import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { protect } from "../../../middlewares/auth";
import { getBus, getTicket, PurchaseTicket } from "./user.controller";

const route = express.Router();


// route.post("/register",validateRequest(UserValidation.SignUpByEmailAndPasswordValidationSchema),signUpUserByEmailandPassword);
// route.post("/login",validateRequest(UserValidation.loginValidationSchema),LoginUserByEmailandPassword);

route.get("/buses",protect,getBus)
route.get("/tickets",protect,getTicket)
route.post("/tickets/purchase",protect,validateRequest(UserValidation.PurchaseTicketValidationSchema),PurchaseTicket)


export const UserRoutes = route;
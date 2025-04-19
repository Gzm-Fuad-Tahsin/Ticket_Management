import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { AdminValidation } from "./admin.validation";
import { createBus, deleteBus, updateBus } from "./bus/bus.controller";
import {  auth } from "../../../middlewares/auth";
import { createService, deleteService, updateService } from "./busServices/service.controller";


const route = express.Router();


route.post("/bus",auth(),validateRequest(AdminValidation.createBusValidationSchema),createBus);
// route.put("/bus/:id",protect,isAdmin,validateRequest(AdminValidation.updateBusValidationSchema),updateBus);
// route.delete("/bus/:id",protect,isAdmin,deleteBus)



// route.post("/ticket",protect,isAdmin,validateRequest(AdminValidation.createBusServiceValidationSchema),createService);
// route.put("/ticket/:id",protect,isAdmin,validateRequest(AdminValidation.createBusServiceValidationSchema),updateService);
// route.delete("/bus/:id",protect,isAdmin,deleteService)



export const AdminRoutes = route;
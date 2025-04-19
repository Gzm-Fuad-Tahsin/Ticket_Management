import mongoose from "mongoose";
import { IBusService } from "./service.interface";
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { BusService } from "./service.model";

const createService = async(payload: IBusService)=>{
    const servicesData: Partial<IBusService>= {
        bus_id: payload.bus_id,
        date: payload.date,
        arrival_time: payload.arrival_time,
        departure_time: payload.departure_time,
        available_seats: payload.available_seats,
        price: payload.price,
        total_seats: payload.total_seats,
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Create the Services
        const Services = await BusService.create([servicesData], { session });
        if (!Services.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Services');
        }



        await session.commitTransaction();



        return {
            Services: Services
        };
    } catch (error) {

        await session.abortTransaction();

        throw new AppError(
            httpStatus.BAD_REQUEST,
            (error as Error).message || 'An unknown error occurred',
            (error as Error)?.stack,
        );
    } finally {

        await session.endSession();
    }
}

const updateService = async(id: string, payload: IBusService)=>{
    const servicesData: Partial<IBusService>= {
        bus_id: payload?.bus_id,
        date: payload?.date,
        arrival_time: payload?.arrival_time,
        departure_time: payload?.departure_time,
        available_seats: payload?.available_seats,
        price: payload?.price,
        total_seats: payload?.total_seats,
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // update the Services
        const Services = await BusService.findByIdAndUpdate(id, servicesData, {
            session,
            new: true,
          });
          if (!Services) {
            throw new AppError(httpStatus.NOT_FOUND, "Services not found");
          }

        await session.commitTransaction();

        return {
            Services: Services
        };
    } catch (error) {

        await session.abortTransaction();

        throw new AppError(
            httpStatus.BAD_REQUEST,
            (error as Error).message || 'An unknown error occurred',
            (error as Error)?.stack,
        );
    } finally {

        await session.endSession();
    }
}

const deleteService = async(id: string)=>{
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // update the Services
        const Services = await BusService.findByIdAndDelete(id, {
            session
          });
          if (!Services) {
            throw new AppError(httpStatus.NOT_FOUND, "Services not found");
          }

        await session.commitTransaction();

        return {
            Services: Services
        };
    } catch (error) {

        await session.abortTransaction();

        throw new AppError(
            httpStatus.BAD_REQUEST,
            (error as Error).message || 'An unknown error occurred',
            (error as Error)?.stack,
        );
    } finally {

        await session.endSession();
    }
}



export const servicesService = {
    createService,
    updateService,
    deleteService
}
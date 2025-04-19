import mongoose from "mongoose";
import { IBus } from "./bus.interface";
import { Bus } from "./bus.model";
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";

const createBus = async (payload: IBus) => {
  const busData: IBus = {
    name: payload.name,
    bus_number: payload.bus_number,
    source: payload.source,
    destination: payload.destination,
    route: payload.route,
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Create the Bus
    const bus = await Bus.create([busData], { session });
    if (!bus.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create Bus");
    }

    await session.commitTransaction();

    return {
      bus: bus,
    };
  } catch (error) {
    await session.abortTransaction();

    throw new AppError(
      httpStatus.BAD_REQUEST,
      (error as Error).message || "An unknown error occurred",
      (error as Error)?.stack
    );
  } finally {
    await session.endSession();
  }
};

const updateBus = async (id: string, payload: IBus) => {
  const busData: Partial<IBus> = {
    name: payload?.name,
    bus_number: payload?.bus_number,
    source: payload?.source,
    destination: payload?.destination,
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Update the Bus
    const bus = await Bus.findByIdAndUpdate(id, busData, {
      session,
      new: true,
    });
    if (!bus) {
      throw new AppError(httpStatus.NOT_FOUND, "Bus not found");
    }
    await session.commitTransaction();
    return {
      bus: bus,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      (error as Error).message || "An unknown error occurred",
      (error as Error)?.stack
    );
  } finally {
    await session.endSession();
  }
};

const deleteBus = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Delete the Bus
    const bus = await Bus.findByIdAndDelete(id, { session });
    if (!bus) {
      throw new AppError(httpStatus.NOT_FOUND, "Bus not found");
    }
    await session.commitTransaction();
    return {
      bus: bus,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      (error as Error).message || "An unknown error occurred",
      (error as Error)?.stack
    );
  } finally {
    await session.endSession();
  }
};

export const busServices = {
  createBus,
  updateBus,
  deleteBus
};

import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { busServices } from "./bus.service";

export const createBus = catchAsync(async (req, res) => {
  const { bus } = await busServices.createBus(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Bus created successfully",
    success: true,
    data: bus,
  });
});

export const updateBus = catchAsync(async (req, res) => {
  const { bus } = await busServices.updateBus(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bus updated successfully",
    success: true,
    data: bus,
  });
});

export const deleteBus = catchAsync(async (req, res) => {
  await busServices.deleteBus(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bus deleted successfully",
    success: true,
    data: "",
  });
});

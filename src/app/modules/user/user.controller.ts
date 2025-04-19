import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RequestHandler } from "express";
import { UserServices } from "./user.service";
import config from "../../config";

export const getBus = catchAsync(async (req, res) => {
  const { bus } = await UserServices.getBus(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bus fetched successfully",
    success: true,
    data: bus,
  });
});
export const getTicket = catchAsync(async (req, res) => {
  const { ticket } = await UserServices.getTicket(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Ticket fetched successfully",
    success: true,
    data: ticket,
  });
});

export const PurchaseTicket = catchAsync(async (req, res) => {
  const { ticket } = await UserServices.PurchaseTicket(req.body,req?.user?._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Ticket purchased successfully",
    success: true,
    data: ticket,
    });
    });


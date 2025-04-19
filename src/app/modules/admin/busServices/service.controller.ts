import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { servicesService } from "./service.service";

export const createService = catchAsync(async (req, res) => {
  const { Services } = await servicesService.createService(req.body);
  sendResponse(res, {
    statusCode: 201,
    message: "Service created successfully",
    success: true,
    data: Services,
  });
});

export const updateService = catchAsync(async (req, res) => {
  const { Services } = await servicesService.updateService(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    message: "Service updated successfully",
    success: true,
    data: Services,
  });
});

export const deleteService = catchAsync(async (req, res) => {
  await servicesService.deleteService(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    message: "Service deleted successfully",
    success: true,
    data: "",
  });
});

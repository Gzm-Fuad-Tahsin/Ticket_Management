
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { RequestHandler } from "express";
import { UserServices } from "./user.service";
import config from "../../config";



// /*-------------------get single user-------------------- */

// export const getUser = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const result = await getSingleUserFromDB(id);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: "User retrieved success",
//     success: true,
//     data: result,
//   });
// });


// /*-----------------get all user-----------------------*/

// export const getAllUser = catchAsync(async(req,res) =>{
//   const query = req.query
//   const result = await getAllUserFromDB(query);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: "All User retrieved success",
//     success: true,
//     data: result,
//   });
// })


// /*------------------Update User Role---------------------*/

// export  const updateUserRole = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const { email,role } = req.body;
//   const result = await updateUserRoleFromDB(id, email, role);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: "Role update successfully",
//     success: true,
//     data: "",
//   });
// })



// /*------------------Update User---------------------*/


// /*-----------------Delete User----------------------*/
// export const deleteUser = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const result = await deleteUserFromDB(id);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: "User deleted successfully",
//     success: true,
//     data:""
//     });
//   });








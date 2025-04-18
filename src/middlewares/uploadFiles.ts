import multer, { FileFilterCallback } from 'multer';
import path from 'path';

import httpStatus from 'http-status';
import { Request } from 'express';
import AppError from '../app/errors/AppError';

// Define allowed file extensions
const allowedExtensions: string[] = ['jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'txt', 'pdf'];

// Multer storage configuration
const storage = multer.diskStorage({
 // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  destination: (req: Request, file: any, cb: (error: Error | null, destination: string) => void) => {
    // cb(null, process.cwd() + '/uploads/'); // Directory to save uploaded files

    cb(null, path.join('uploads'))
  },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  filename: (req: Request, file: any, cb: (error: Error | null, filename: string) => void) => {
    const userID = req.info?.userID || 'anonymous'; // Assume `req.user` has user info with `_id`
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${userID}-${uniqueSuffix}${fileExtension}`);
  },
});

// File filter for validating file extensions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileFilter = (req: Request, file: any, cb: FileFilterCallback): void => {
  const fileExtension = path.extname(file.originalname).slice(1).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    cb(new AppError(httpStatus.BAD_REQUEST, 'Invalid file type'));
  } else {
    cb(null, true);
  }
};

// Export the configured Multer instance
export const upload = multer({
  storage,
  fileFilter,
});

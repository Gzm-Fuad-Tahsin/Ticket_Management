import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (valueItems: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: valueItems.path,
        message: valueItems.message,
      };
    },
  );

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleValidationError;

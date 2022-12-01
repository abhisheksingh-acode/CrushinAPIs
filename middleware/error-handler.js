import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (error, req, res, next) => {
  let DEFAULT_RESPONSE = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    status: "request failed",
    type: "internal",
    errors: error,
  };

  if (error.name === "ValidationError") {
    let array_err = Object.values(error.errors)
      .map((item) => item.message)
      .join(",");

    DEFAULT_RESPONSE = {
      statusCode: StatusCodes.BAD_REQUEST,
      status: "request validation failed",
      type: "validation",
      errors: {message:array_err},
    };
  }

  let { statusCode, status, errors, type } = DEFAULT_RESPONSE;
  
   res.status(statusCode).json({statusCode, status, error: errors.message, type });
};

export default errorHandlerMiddleware;

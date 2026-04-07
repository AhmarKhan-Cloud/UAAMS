const mongoose = require("mongoose");

const notFound = (req, _res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      details: Object.values(err.errors).map((item) => item.message),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value found for a unique field.",
      details: err.keyValue,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error.",
    details: err.details || null,
  });
};

module.exports = {
  notFound,
  errorHandler,
};

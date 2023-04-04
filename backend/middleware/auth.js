const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new ErrorHandler("Login first to access this resource", 400));
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decodedData.id);

    next();
  } catch (error) {
    return next(new ErrorHandler("Login first to access this resource", 400));
  }
});

exports.authorisedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          message: `User ${req.user.role} is not allowed to perform this action`,
        })
      );
    }
    next();
  };
};

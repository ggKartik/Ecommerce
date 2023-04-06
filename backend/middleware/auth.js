const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsyncError = require("./catchAsyncError");
// const ErrorHandler = require("../utils/errorHandler");
exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.json
        .status(400)
        .json({ message: "Login first to access this resource" });
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decodedData.id);

    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Login first to access this resource" });
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

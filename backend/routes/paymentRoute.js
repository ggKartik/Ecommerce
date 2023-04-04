const express = require("express");

const {
  checkOut,
  paymentVerification,
  getKey,
} = require("../controller/paymentController");

const { isAuthenticated } = require("../middleware/auth");

const paymentRouter = express.Router();

paymentRouter.route("/checkout").post(isAuthenticated, checkOut);
paymentRouter.route("/getkey").get(isAuthenticated, getKey);

//for callback url from payment gateway razorpay
// paymentRouter.route("/paymentverification").post(paymentVerification);

module.exports = paymentRouter;

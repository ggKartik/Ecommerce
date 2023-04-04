const express = require("express");
const mongoose = require("mongoose");

const {
  createNewOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/orderController");
const { isAuthenticated, authorisedRoles } = require("../middleware/auth");

const orderRouter = express.Router();

orderRouter.route("/order/new").post(isAuthenticated, createNewOrder);
orderRouter.route("/order/:id").get(isAuthenticated, getSingleOrder);
orderRouter.route("/myorders").get(isAuthenticated, myOrders);
orderRouter
  .route("/admin/orders")
  .get(isAuthenticated, authorisedRoles("admin"), getAllOrders);

orderRouter
  .route("/admin/order/:id")
  .put(isAuthenticated, authorisedRoles("admin"), updateOrderStatus)
  .delete(isAuthenticated, authorisedRoles("admin"), deleteOrder);

module.exports = orderRouter;

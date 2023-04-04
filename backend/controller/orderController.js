const Order = require("../models/orderModel");
const Product = require("../models/productModel");

//create new order
exports.createNewOrder = async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });

  res.status(201).json({ success: "true", messge: "Order Create", order });
};

//get single order
exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.json({ messge: `Order Does Not Exists With ID: ${req.params.id}` });
  }

  res.status(200).json({ success: "true", order });
};

//Get My Order
exports.myOrders = async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  res.status(200).json({ success: "true", order });
};

//Get All Order -- Admin
exports.getAllOrders = async (req, res, next) => {
  const order = await Order.find();

  let totalAmount = 0;
  order.forEach((i) => {
    totalAmount += i.totalPrice;
  });

  res.status(200).json({ success: "true", totalAmount, order });
};

//update order status
exports.updateOrderStatus = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.json({ messge: `Order Not found with this id` });
  }

  if (order.orderStatus === "Delivered") {
    res.status(400).json({
      success: "true",
      messge: "You have already delivered this order",
    });
  }
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (i) => {
      await updateStock(i.product, i.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.json({ success: "true" });
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

//delete order -- Admin
exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.json({ messge: `Order Not found with this id` });
  }
  await order.remove();

  res.status(200).json({ success: "true" });
};

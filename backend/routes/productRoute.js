const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getAllReviewsOfAProduct,
  deleteReview,
  getProductsAdmin,
} = require("../controller/productController");
const { isAuthenticated, authorisedRoles } = require("../middleware/auth");

const productRouter = express.Router();

productRouter.route("/products").get(getAllProducts);

productRouter
  .route("/admin/products/new")
  .post(isAuthenticated, authorisedRoles("admin"), createProduct);

productRouter
  .route("/admin/products/:id")
  .put(isAuthenticated, authorisedRoles("admin"), updateProduct)
  .delete(isAuthenticated, authorisedRoles("admin"), deleteProduct);

productRouter
  .route("/admin/products")
  .get(isAuthenticated, authorisedRoles("admin"), getProductsAdmin);

productRouter.route("/products/:id").get(getProductDetails);

productRouter
  .route("/product/review")
  .get(isAuthenticated, getAllReviewsOfAProduct)
  .delete(isAuthenticated, deleteReview);

productRouter
  .route("/products/reviews")
  .put(isAuthenticated, createProductReview);

module.exports = productRouter;

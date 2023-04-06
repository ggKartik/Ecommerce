const { findById, findByIdAndDelete } = require("../models/productModel");
const products = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const ApiFeateure = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//create product -- Admin
exports.createProduct = async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  const product = await products.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
};

//get all product
exports.getAllProducts = async (req, res, next) => {
  try {
    const itemsPerPage = 8;
    const productCount = await products.countDocuments();
    const apiFeature = new ApiFeateure(products.find(), req.query)
      .search()
      .filter();

    let Products = await apiFeature.query;

    let filteredProductsCount = await Products.length;

    apiFeature.pagination(itemsPerPage);

    Products = await apiFeature.query.clone();

    res.status(200).json({
      success: true,
      productCount,
      Products,
      itemsPerPage,
      filteredProductsCount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update product -- Admin
exports.updateProduct = async (req, res, next) => {
  let Product = await products.findById(req.params.id);
  if (!Product) {
    res.status(400).json({ message: "Product Not Found" });
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < Product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(Product.images[i].public_id);
    }

    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  Product = await products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, Product });
};

//delete product -- Admin
exports.deleteProduct = async (req, res, next) => {
  let Product = await products.findById(req.params.id);
  if (!Product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  //delete images from cloudinary
  for (let i = 0; i < Product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(Product.images[i].public_id);
  }

  await Product.remove();
  res.status(200).json({ success: true, message: "Product Deleted" });
};

//get product details
exports.getProductDetails = async (req, res, next) => {
  let Product = await products.findById(req.params.id);
  if (!Product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({ success: true, Product });
};

//create or update product review
exports.createProductReview = async (req, res, next) => {
  const { comment, rating, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await products.findById(productId);

  if (!product) {
    res.json({ message: "This Product Does Not Exists" });
  }

  const isReviewd = product.reviews.find(
    (i) => i.user.toString() === req.user._id.toString()
  );

  if (isReviewd) {
    product.reviews.forEach((i) => {
      if (i.user.toString() === req.user._id.toString()) {
        (i.rating = rating), (i.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((i) => {
    avg += i.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: "true", message: "Review Created/Updated" });
};

//get all reviews of a product
exports.getAllReviewsOfAProduct = async (req, res, next) => {
  const product = await products.findById(req.query.id);
  if (!product) {
    res.json({ message: `Product With id: ${req.query.id} Does Not Exists` });
  }
  res.status(200).json({ success: "true", Reviews: product.reviews });
};

//delete review
exports.deleteReview = async (req, res, next) => {
  const product = await products.findById(req.query.productId);
  if (!product) {
    res.status(404).json({
      message: `Product With id: ${req.query.productId} Does Not Exists`,
    });
  }

  const reviews = product.reviews.filter(
    (i) => i._id.toString() !== req.query.reviewId.toString()
  );

  let ratings = null;
  let numOfReviews = null;
  if (reviews.length === 0) {
    ratings = 0;
    numOfReviews = 0;
  } else {
    let avg = 0;
    for (let i = 0; i < reviews.length; i++) {
      avg += reviews[i].rating;
    }
    ratings = avg / reviews.length;
    numOfReviews = reviews.length;
  }

  await products.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({ success: "true", message: "Review Deleted" });
};

exports.getProductsAdmin = async (req, res) => {
  try {
    const Products = await products.find();
    res.status(200).json({
      success: true,
      Products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

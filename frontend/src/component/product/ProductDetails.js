import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
// import {
//   CarouselProvider,
//   Slider,
//   Slide,
//   ButtonBack,
//   ButtonNext,
// } from "pure-react-carousel";
// import "pure-react-carousel/dist/react-carousel.es.css";

import {
  clearErrors,
  createNewReview,
  getProductDetails,
} from "../../actions/productAction";

import { useDispatch, useSelector } from "react-redux";
import "./productDetails.css";
import Loader from "../layout/loader/Loader";
import ReviewCard from "./ReviewCard";
import Rating from "@mui/material/Rating";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addToCart } from "../../actions/cartActions";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { error: reviewError, success } = useSelector(
    (state) => state.newReview
  );

  const { isAuthenticated } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    const qty = quantity - 1;
    setQuantity(qty);
  };

  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const submitReviewToggle = () => {
    if (!isAuthenticated) {
      alert.error("Please Login to review this product");
      return;
    }
    setOpen(!open);
  };
  const reviewSubmitHandler = () => {
    const formData = new FormData();
    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("productId", id);
    dispatch(createNewReview(formData));
    setOpen(false);
  };

  const addToCartHandler = () => {
    alert.success("Product Added to Cart");
    dispatch(addToCart(product._id, quantity));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review Added Successfully");
      dispatch({ type: "NEW_REVIEW_RESET" });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert, reviewError, success]);

  const options = {
    size: "medium",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;

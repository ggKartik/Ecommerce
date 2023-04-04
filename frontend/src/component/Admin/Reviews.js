import { Button } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import "./Reviews.css";
import SideBar from "./SideBar";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import {
  clearErrors,
  deleteReview,
  getAllReviews,
} from "../../actions/productAction";
import { DataGrid } from "@material-ui/data-grid";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const Reviews = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [productId, setProductId] = useState("");

  const { loading, reviews, error } = useSelector((state) => state.allReviews);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteReview
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, alert, error, deleteError, isDeleted, navigate]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200 },

    {
      field: "user",
      headerName: "User",
      minWidth: 200,
    },

    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,

      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      flex: 0.1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteRoundedIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((review) => {
      rows.push({
        id: review._id,
        user: review.name,
        comment: review.comment,
        rating: review.rating,
      });
    });

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  const deleteReviewHandler = (id) => {
    dispatch(deleteReview(id, productId));
  };

  return (
    <Fragment>
      <MetaData title={`ALL REVIEWS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <StarRoundedIcon />
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={
                loading ? true : false || productId === "" ? true : false
              }
            >
              Search
            </Button>
          </form>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="productListTable"
              autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Reviews;

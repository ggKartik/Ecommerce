import React from "react";
import Rating from "@mui/material/Rating";
import profilePng from "../../images/Profile.png";
import "./ReviewCard.css";
const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
    size: "small",
  };

  return (
    <div className="card">
      <div className="card-img">
        <img src={profilePng} alt="User" />
      </div>
      <div className="card-info">
        <p className="text-title">{review.name}</p>
        <Rating {...options} />
        <p className="text-body">{review.comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;

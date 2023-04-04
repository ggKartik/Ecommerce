import React from "react";
import "./Pcard.css";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";

const Pcard = ({ product }) => {
  const navigate = useNavigate();

  const buttonClick = () => {
    navigate(`/product/${product._id}`);
  };

  const options = {
    value: product.ratings,
    size: "small",
    readOnly: true,
    precision: 0.5,
  };
  return (
    <div class="cardp">
      <div class="cardp-image">
        <img src={product.images[0].url} alt={product.name} />
      </div>
      <div class="category">
        {" "}
        <Rating {...options} />{" "}
      </div>
      <div class="heading">
        {product.name}
        <div class="author">₹ {product.price}</div>
      </div>
      <button class="cardp-button" onClick={buttonClick}>
        More info
      </button>
    </div>
  );
};

export default Pcard;

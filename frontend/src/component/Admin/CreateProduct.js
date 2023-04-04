import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import "./CreateProduct.css";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router";
import { clearErrors, createProductAdmin } from "../../actions/productAction";
import { Button } from "@mui/material";

import SpellcheckRoundedIcon from "@mui/icons-material/SpellcheckRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { success, error } = useSelector((state) => state.newProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setstock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const createProductSubmitHandler = (e) => {
    setIsCreating(true);
    e.preventDefault();
    const myform = new FormData();
    myform.append("name", name);
    myform.append("price", price);
    myform.append("description", description);
    myform.append("category", category);
    myform.append("stock", stock);

    images.forEach((image) => {
      myform.append("images", image);
    });

    dispatch(createProductAdmin(myform));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Product Created Successfully");
      navigate("/admin/dashboard");
      dispatch({ type: "NEW_PRODUCT_RESET" });
    }
  }, [dispatch, alert, error, success, navigate]);

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  return (
    <Fragment>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>

            <div>
              <SpellcheckRoundedIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <CurrencyRupeeRoundedIcon />
              <input
                type="number"
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <DescriptionRoundedIcon />

              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <CategoryRoundedIcon />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <StorageRoundedIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                onChange={(e) => setstock(e.target.value)}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button id="createProductBtn" type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateProduct;

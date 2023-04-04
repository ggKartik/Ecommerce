import React, { Fragment, useEffect } from "react";
import "./ProductList.css";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@mui/material";
import {
  getProductsAdmin,
  clearErrors,
  deleteProductAdmin,
} from "../../actions/productAction";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/loader/Loader";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const ProductList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { products, error, loading } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.productAction
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
      alert.success("Product Deleted Successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
      navigate("/admin/products");
    }
    dispatch(getProductsAdmin());
  }, [dispatch, error, alert, isDeleted, deleteError, navigate]);

  const deleteProductHandler = (id) => {
    dispatch(deleteProductAdmin(id));
  };

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 1 },

    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 1,
      minWidth: 150,
    },

    {
      field: "price",
      headerName: "Price",
      flex: 1,
      type: "number",
      minWidth: 200,
    },

    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 1,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link
              className="ListLinkTag"
              to={`/admin/product/${params.getValue(params.id, "id")}`}
            >
              <EditRoundedIcon />
            </Link>

            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
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

  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      });
    });

  return (
    <Fragment>
      {loading ? (
        Loader
      ) : (
        <Fragment>
          <MetaData title={`ALL PRODUCTS - Admin`} />

          <div className="dashboard">
            <SideBar />
            <div className="productListContainer">
              <h1 id="productListHeading">ALL PRODUCTS</h1>

              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                className="productListTable"
                autoHeight
              />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductList;

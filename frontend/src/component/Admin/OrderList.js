import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrderAdmin,
  getAllOrdersAdmin,
} from "../../actions/orderActions";
import MetaData from "../layout/MetaData";
import SideBar from "./SideBar";
import { DataGrid } from "@material-ui/data-grid";
import { useAlert } from "react-alert";
import { clearErrors } from "../../actions/productAction";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const OrderList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, error: orderError } = useSelector((state) => state.allOrders);
  const { error, isDeleted } = useSelector((state) => state.orderAction);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (orderError) {
      alert.error(orderError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Order deleted successfully");
      navigate("/admin/orders");
      dispatch({ type: "DELETE_ORDER_RESET" });
    }

    dispatch(getAllOrdersAdmin());
  }, [dispatch, alert, error, isDeleted, orderError, navigate]);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrderAdmin(id));
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link
              className="ListLinkTag"
              to={`/admin/order/${params.getValue(params.id, "id")}`}
            >
              <EditRoundedIcon />
            </Link>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
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

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL ORDERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>

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
  );
};

export default OrderList;

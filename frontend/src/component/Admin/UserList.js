import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allUsersAdmin, deleteUser } from "../../actions/userAction";
import { useAlert } from "react-alert";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import SideBar from "./SideBar";
import { DataGrid } from "@material-ui/data-grid";
import MetaData from "../layout/MetaData";
import { clearErrors } from "../../actions/productAction";
import { useNavigate } from "react-router-dom";
import { DELETE_USER_RESET } from "../../constants/userConstants";

const UserList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { users, error } = useSelector((state) => state.allUsers);
  const { error: DeleteError, isDeleted } = useSelector(
    (state) => state.userAction
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (DeleteError) {
      alert.error(DeleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("User Deleted Successfully");
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(allUsersAdmin());
  }, [dispatch, alert, error, isDeleted, navigate, DeleteError]);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 200,
    },
    {
      field: "email",
      headerName: "User Email",
      minWidth: 200,
      flex: 2,
    },
    {
      field: "name",
      headerName: "User Name",
      minWidth: 200,
      cellClassName: "listItemsCenter",
    },
    {
      field: "role",
      headerName: "User Role",
      minWidth: 200,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
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
              to={`/admin/users/${params.getValue(params.id, "id")}`}
              className="ListLinkTag"
            >
              <EditRoundedIcon />
            </Link>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
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

  users &&
    users.forEach((user) => {
      rows.push({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

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

export default UserList;

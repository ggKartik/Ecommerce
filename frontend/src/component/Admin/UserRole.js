import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import SideBar from "./SideBar";
import "./userRole.css";
import Loader from "../layout/loader/Loader";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Button } from "@mui/material";
import { clearErrors } from "../../actions/productAction";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import { getUserDetails, updateUser } from "../../actions/userAction";

import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

const UserRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { id: userId } = useParams();
  console.log(userId);

  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.userAction
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("User updated successfully");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, alert, error, isUpdated, updateError, navigate, userId, user]);

  const updateUserSubmitHandler = (e) => {
    setIsProcessing(true);
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("role", role);
    dispatch(updateUser(userId, formData));
  };

  return (
    <Fragment>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <AlternateEmailIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserRoundedIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                disabled={isProcessing || role === "" ? true : false}
              >
                {isProcessing ? "Updating..." : "Update"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UserRole;

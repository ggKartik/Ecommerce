import React, { Fragment, useEffect, useState } from "react";
import "./UpdatePassword.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { clearErrors } from "../../actions/productAction";
import { updatePassword } from "../../actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import Loader from "../layout/loader/Loader";
import MetaData from "../layout/MetaData";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { isUpdated, error, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Password Updated Successfully");
      navigate("/account");
      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, alert, navigate, isUpdated]);

  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const passwords = new FormData();
    passwords.set("oldPassword", oldPassword);
    passwords.set("newPassword", newPassword);
    passwords.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(passwords));
  };

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const showPassword = () => {
    setShow(!show);
  };
  const showPassword1 = () => {
    setShow1(!show1);
  };
  const showPassword2 = () => {
    setShow2(!show2);
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Change Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Profile</h2>

              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyRoundedIcon />
                  <input
                    type={show ? "text" : "password"}
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  {oldPassword.length > 0 && (
                    <span onClick={showPassword} className="showPassword">
                      {show ? (
                        <VisibilityOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      )}
                    </span>
                  )}
                </div>

                <div className="loginPassword">
                  <LockOpenRoundedIcon />
                  <input
                    type={show1 ? "text" : "password"}
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {newPassword.length > 0 && (
                    <span onClick={showPassword1} className="showPassword">
                      {show1 ? (
                        <VisibilityOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      )}
                    </span>
                  )}
                </div>
                <div className="loginPassword">
                  <LockRoundedIcon />
                  <input
                    type={show2 ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword.length > 0 && (
                    <span onClick={showPassword2} className="showPassword">
                      {show2 ? (
                        <VisibilityOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      )}
                    </span>
                  )}
                </div>

                <input
                  type="submit"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;

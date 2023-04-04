import React, { Fragment, useEffect, useState } from "react";
import "./ResetPassword.css";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/Loader";
import { resetPassword, clearErrors } from "../../actions/userAction";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { useNavigate, useParams } from "react-router";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const ResetPassword = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, error, success } = useSelector(
    (state) => state.forgotPassword
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Password Reset Successful");
      navigate("/login");
    }
  }, [dispatch, alert, error, success, navigate]);

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(token, formData));
  };

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

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
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Set Password</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >
                <div>
                  <LockOpenRoundedIcon />
                  <input
                    type={show1 ? "text" : "password"}
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password.length > 0 && (
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
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;

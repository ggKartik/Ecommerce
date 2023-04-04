import React, { Fragment, useState } from "react";
import "./Header.css";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import Backdrop from "@mui/material/Backdrop";

const UserOptions = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { cartItems } = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);

  const dashboard = () => {
    navigate("/admin/dashboard");
  };

  const account = () => {
    navigate("/account");
  };

  const orders = () => {
    navigate("/orders/me");
  };

  const logoutUser = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
  };

  const cart = () => {
    navigate("/Cart");
  };
  const options = [
    { name: "profile", icon: <PersonIcon />, func: account },
    { name: "orders", icon: <ListAltIcon />, func: orders },
    {
      name: `Cart (${cartItems.length})`,
      icon: (
        <ShoppingCartRoundedIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      func: cart,
    },
    { name: "logout", icon: <ExitToAppIcon />, func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      name: "dashboard",
      icon: <DashboardRoundedIcon />,
      func: dashboard,
    });
  }

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;

import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";
import { TreeItem, TreeView } from "@material-ui/lab";
import logo from "../../images/logo.png";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";

const SideBar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <DashboardRoundedIcon /> Dashboard
        </p>
      </Link>
      <Link>
        <TreeView
          defaultCollapseIcon={<ExpandLessRoundedIcon />}
          defaultExpandIcon={<ExpandMoreRoundedIcon />}
        >
          <TreeItem nodeId="1" label="Products">
            <Link to="/admin/products">
              <TreeItem nodeId="2" label="All" icon={<PostAddRoundedIcon />} />
            </Link>

            <Link to="/admin/createProduct">
              <TreeItem nodeId="3" label="Create" icon={<AddRoundedIcon />} />
            </Link>
          </TreeItem>
        </TreeView>
      </Link>
      <Link to="/admin/orders">
        <p>
          <ListRoundedIcon />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <PersonRoundedIcon /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReviewRoundedIcon />
          Reviews
        </p>
      </Link>
    </div>
  );
};

export default SideBar;

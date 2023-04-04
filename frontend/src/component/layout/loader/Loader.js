import React from "react";
import { HashLoader } from "react-spinners";
import "../loader/Loader.css";

const loader = () => {
  return (
    <div className="loader">
      <HashLoader color="#FF6347" />
    </div>
  );
};

export default loader;

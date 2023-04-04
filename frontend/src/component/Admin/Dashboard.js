import React, { Fragment, useEffect } from "react";
import "./Dashboard.css";
import SideBar from "./SideBar";
import MetaData from "../layout/MetaData";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getProductsAdmin } from "../../actions/productAction";
import { useSelector } from "react-redux";
import Loader from "../layout/loader/Loader";
import { getAllOrdersAdmin } from "../../actions/orderActions";
import { allUsersAdmin } from "../../actions/userAction";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

const data = [
  {
    id: "Electronics",
    color: "hsl(235, 70%, 50%)",
    data: [
      {
        x: "Jan",
        y: 27,
      },
      {
        x: "Feb",
        y: 51,
      },
      {
        x: "March",
        y: 139,
      },
      {
        x: "April",
        y: 200,
      },
      {
        x: "May",
        y: 242,
      },
      {
        x: "June",
        y: 102,
      },
      {
        x: "July",
        y: 147,
      },
      {
        x: "Aug",
        y: 239,
      },
      {
        x: "Sept",
        y: 1,
      },
      {
        x: "Oct",
        y: 165,
      },
      {
        x: "Nov",
        y: 54,
      },
      {
        x: "Dec",
        y: 185,
      },
    ],
  },
  {
    id: "Footwear",
    color: "hsl(86, 70%, 50%)",
    data: [
      {
        x: "Jan",
        y: 99,
      },
      {
        x: "Feb",
        y: 4,
      },

      {
        x: "March",
        y: 231,
      },
      {
        x: "April",
        y: 238,
      },
      {
        x: "May",
        y: 249,
      },
      {
        x: "June",
        y: 186,
      },
      {
        x: "July",
        y: 254,
      },
      {
        x: "Aug",
        y: 34,
      },
      {
        x: "Sept",
        y: 48,
      },
      {
        x: "Oct",
        y: 75,
      },
      {
        x: "Nov",
        y: 218,
      },
      {
        x: "Dec",
        y: 108,
      },
    ],
  },
  {
    id: "Clothing",
    color: "hsl(321, 70%, 50%)",
    data: [
      {
        x: "Jan",
        y: 162,
      },
      {
        x: "Feb",
        y: 260,
      },

      {
        x: "March",
        y: 202,
      },
      {
        x: "April",
        y: 78,
      },
      {
        x: "May",
        y: 214,
      },
      {
        x: "June",
        y: 36,
      },
      {
        x: "July",
        y: 148,
      },
      {
        x: "Aug",
        y: 239,
      },
      {
        x: "Sept",
        y: 97,
      },
      {
        x: "Oct",
        y: 164,
      },
      {
        x: "Nov",
        y: 48,
      },
      {
        x: "Dec",
        y: 167,
      },
    ],
  },
  {
    id: "Cameras",
    color: "hsl(199, 70%, 50%)",
    data: [
      {
        x: "Jan",
        y: 12,
      },
      {
        x: "Feb",
        y: 180,
      },

      {
        x: "March",
        y: 66,
      },
      {
        x: "April",
        y: 228,
      },
      {
        x: "May",
        y: 18,
      },
      {
        x: "June",
        y: 160,
      },
      {
        x: "July",
        y: 158,
      },
      {
        x: "Aug",
        y: 157,
      },
      {
        x: "Sept",
        y: 294,
      },
      {
        x: "Oct",
        y: 116,
      },
      {
        x: "Nov",
        y: 20,
      },
      {
        x: "Dec",
        y: 197,
      },
    ],
  },
  {
    id: "Mobiles",
    color: "hsl(322, 70%, 50%)",
    data: [
      {
        x: "Jan",
        y: 76,
      },
      {
        x: "Feb",
        y: 256,
      },

      {
        x: "March",
        y: 119,
      },
      {
        x: "April",
        y: 186,
      },
      {
        x: "May",
        y: 198,
      },
      {
        x: "June",
        y: 9,
      },
      {
        x: "July",
        y: 288,
      },
      {
        x: "Aug",
        y: 19,
      },
      {
        x: "Sept",
        y: 153,
      },
      {
        x: "Oct",
        y: 111,
      },
      {
        x: "Nov",
        y: 291,
      },
      {
        x: "Dec",
        y: 143,
      },
    ],
  },
];

const MyResponsiveLine = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Month",
      legendOffset: 36,
      legendPosition: "middle",
    }}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Count",
      legendOffset: -40,
      legendPosition: "middle",
    }}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { orders, totalAmount } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;

  products &&
    products.forEach((product) => {
      if (product.stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getProductsAdmin());
    dispatch(getAllOrdersAdmin());
    dispatch(allUsersAdmin());
  }, [dispatch]);

  const dataPie = [
    {
      id: "stock",
      label: "In Stock",
      value: products.length - outOfStock,
      color: "hsl(19, 70%, 50%)",
    },
    {
      id: "outofstock",
      label: "Out Of Stock",
      value: outOfStock,
      color: "hsl(255, 70%, 50%)",
    },
  ];

  const MyResponsivePie = ({ dataPie }) => (
    <ResponsivePie
      data={dataPie}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "stock",
          },
          id: "dots",
        },
        {
          match: {
            id: "outofstock",
          },
          id: "lines",
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard">
          <MetaData title="Dashboard - Admin Panel" />
          <SideBar />

          <div className="dashboardContainer">
            <Typography component="h1">Dashboard</Typography>

            <div className="dashboardSummary">
              <div>
                <p>
                  Total Amount <br /> ₹{totalAmount}
                </p>
              </div>
              <div className="dashboardSummaryBox2">
                <Link to="/admin/products">
                  <p>Products</p>
                  <p>{products && products.length}</p>
                </Link>
                <Link to="/admin/orders">
                  <p>Orders</p>
                  <p>{orders && orders.length}</p>
                </Link>
                <Link to="/admin/users">
                  <p>Users</p>
                  <p>{users && users.length}</p>
                </Link>
              </div>
            </div>

            <div className="lineChart">{<MyResponsiveLine data={data} />}</div>

            <div className="doughnutChart">
              {<MyResponsivePie dataPie={dataPie} />}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Dashboard;

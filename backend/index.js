const Express = require("express");
const app = Express();
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const bodyparser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: "config/config.env" });

app.use(Express.json());
var cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cors());

const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRouter");
const orderRouter = require("./routes/orderRoute");
const paymentRouter = require("./routes/paymentRoute");
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", paymentRouter);
const mongoose = require("mongoose");
const { urlencoded } = require("express");
const connectDB = require("./database/db");
connectDB();

app.use(Express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
app.listen(process.env.PORT || 3601, (e) => {
  if (e) {
    console.log("Error");
    return;
  }
  console.log(`Server Running fine on port ${process.env.PORT || 3601}`);
});

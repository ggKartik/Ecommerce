const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config({ path: "config.env" });

app.use(cors());

// config
const connectDB = require("./database/db");
const cloudinary = require("cloudinary");

// connecting database
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));

//import route
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRouter");
const orderRouter = require("./routes/orderRoute");
const paymentRouter = require("./routes/paymentRoute");

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html")),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    };
});

app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", paymentRouter);

//middleware for error
// app.use(errorMiddlware);

app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

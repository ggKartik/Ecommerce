const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddlware = require("./middleware/error");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

//config
const connectDB = require("./database/db");
const cloudinary = require("cloudinary");
//config
dotenv.config({ path: "config.env" });

//connecting database
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// app.use(express.json());
// app.use(cookieParser());
// app.use(fileUpload());
// app.use(bodyParser.urlencoded({ extended: true }));

// //import route
// const productRouter = require("./routes/productRoute");
// const userRouter = require("./routes/userRouter");
// const orderRouter = require("./routes/orderRoute");
// const paymentRouter = require("./routes/paymentRoute");

// if (process.env.NODE_ENV === "development") {
app.get("/", (req, res) => {
  res.send("API is running..");
});
// } else {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));
//   //   app.get("*", (req, res) => {
//   //     res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
//   //   });
// }

// app.use("/api/v1", productRouter);
// app.use("/api/v1", userRouter);
// app.use("/api/v1", orderRouter);
// app.use("/api/v1", paymentRouter);

// //middleware for error
// app.use(errorMiddlware);

app.listen(process.env.PORT || 4500, () => {
  console.log(
    `server is working on http://localhost:${process.env.PORT || 4500}`
  );
});

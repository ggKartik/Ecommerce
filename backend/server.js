const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const cloudinary = require("cloudinary");
//config
dotenv.config({ path: "backend/config.env" });

//connecting database
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

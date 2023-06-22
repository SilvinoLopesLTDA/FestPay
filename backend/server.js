// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/errorMiddleware");
// const path = require("path");

const userRoute = require("./routes/userRoute");
const clientRoute = require("./routes/clientRoute");
const shopRoute = require("./routes/shopRoute");
const qrCodeRoute = require("./routes/qrCodeRoute");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://festpay.vercel.app"],
    credentials: true,
  })
);
app.options("*", cors());

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes Middleware
app.use("/api/user", userRoute);
app.use("/api/clients", clientRoute);
app.use("/api/shops", shopRoute);
app.use("/api/qrCode", qrCodeRoute);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Error MiddleWare
app.use(errorHandler);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

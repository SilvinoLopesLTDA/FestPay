const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/errorMiddleware");
const compression = require("compression");
const path = require("path");

const userRoute = require("./routes/userRoute");
const clientRoute = require("./routes/clientRoute");
const shopRoute = require("./routes/shopRoute");
const qrCodeRoute = require("./routes/qrCodeRoute");
const itemRoute = require("./routes/itemRoute");

const app = express();

app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://festpay.vercel.app",
      "https://festpay-kw22.onrender.com",
      "https://festpay-dev.vercel.app",
      "https://festpay-dev-branch.onrender.com",
    ],
    credentials: true,
    allowedHeaders: ["Content-Encoding", "Content-Type", "Cookie"],
  })
);
app.use(express.static(path.join(__dirname, "dist")));
app.options("*", cors());

app.use("/api/user", userRoute);
app.use("/api/clients", clientRoute);
app.use("/api/shops", shopRoute);
app.use("/api/items", itemRoute);
app.use("/api/qrCode", qrCodeRoute);

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

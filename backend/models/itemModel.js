const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const itemSchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
  },
  {
    timesStamps: true,
  }
);

const Shop = mongoose.model("Item", itemSchema);
module.exports = Shop;

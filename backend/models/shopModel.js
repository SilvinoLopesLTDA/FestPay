const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const itemSchema = mongoose.Schema({
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
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const shopSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    items: [itemSchema],
    profit: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
    purchases: [
      {
        type: mongoose.Schema.Types.Mixed,
        ref: "Purchase",
      },
    ],
    costsUpdated: [
      {
        type: mongoose.Schema.Types.Mixed,
        ref: "Cost",
      },
    ],
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;

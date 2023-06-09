const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const shopSchema = mongoose.Schema(
  {
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
    cost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;

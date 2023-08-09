const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const costSchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    costValue: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cost = mongoose.model("Cost", costSchema);
module.exports = Cost;

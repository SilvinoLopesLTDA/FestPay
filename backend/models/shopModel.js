const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
  },
});

const shopSchema = mongoose.Schema({
  name: {
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
});

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;

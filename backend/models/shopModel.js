const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  items: [{
    name: String,
    price: {
      type: Number,
      get: getPrice,
      set: setPrice,
    },
  }],
  profit: {
    type: Number,
    default: 0,
  },
  cost: {
    type: Number,
    default: 0,
  },
});

function getPrice(price) {
  return price;
}

function setPrice(price) {
  const client = this.client;
  const clientCredits = client.credits;

  if (price <= clientCredits) {
    client.credits -= price;
    this.profit += price;
    return price;
  } else {
    throw new Error("Creditos Insuficientes, recarregue no caixa mais proximo");
  }
}

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;

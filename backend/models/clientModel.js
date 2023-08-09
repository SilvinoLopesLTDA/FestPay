const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const clientSchema = mongoose.Schema(
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
    phone: {
      type: String,
      default: "+55",
    },
    email: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Débito", "Crédito", "Dinheiro", "Pix"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    qrCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;

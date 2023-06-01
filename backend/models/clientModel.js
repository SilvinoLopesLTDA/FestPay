const mongoose = require("mongoose");
const QRCode = require("qrcode");

mongoose.set("strictQuery", false);

const clientSchema = mongoose.Schema(
  {
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

clientSchema.pre("save", async function (next) {
  try {
    const qrCodeData = {
      name: this.name,
      phone: this.phone,
      paymentMethod: this.paymentMethod,
      balance: this.balance,
    };
    this.qrCode = await generateQRCode(JSON.stringify(qrCodeData));
    next();
  } catch (error) {
    next(error);
  }
});

async function generateQRCode(data) {
  const qrCode = await QRCode.toDataURL(data);
  return qrCode;
}

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;

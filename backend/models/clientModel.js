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
    paymentMethod: {
      type: String,
      enum: ["debito", "credito", "dinheiro"],
      required: true,
    },
    credits: {
      type: Number,
      default: 0,
      enum: [5, 10, 20, 50, 100],
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
    };
    this.qrCode = await generateQRCode(JSON.stringify(qrCodeData));
    next();
  } catch (error) {
    next(error);
  }
});

async function generateQRCode(data) {
  try {
    const qrCode = await QRCode.toDataURL(data);
    return qrCode;
  } catch (error) {
    throw error;
  }
}

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;

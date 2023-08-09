const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const AdminTokenShema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const AdminToken = mongoose.model("AdminToken", AdminTokenShema);
module.exports = AdminToken;

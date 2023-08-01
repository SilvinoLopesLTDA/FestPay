const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.set("strictQuery", false);

const adminShema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      require: [true, "Por favor adcione um nome"],
    },
    email: {
      type: String,
      require: [true, "Por favor adcione um email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Por favor adcione um email valido",
      ],
    },
    password: {
      type: String,
      minLength: [6, "A senha dever conter no minimo 6 caracteres"],
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving to DB
adminShema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const Admin = mongoose.model("Admin", adminShema);
module.exports = Admin;

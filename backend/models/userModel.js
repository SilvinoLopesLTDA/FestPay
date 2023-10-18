const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.set("strictQuery", false);

const subaccountSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Por favor, adicione um nome."],
    },
    email: {
      type: String,
      required: [true, "Por favor, adicione um email."],
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Por favor, adicione um email válido.",
      ],
    },
    photo: {
      type: String,
      require: [true, "Por favor, adicione uma foto."],
      default:
        "https://res.cloudinary.com/dpyrlntco/image/upload/v1682021547/avatar_ilj8xe.png",
    },
    phone: {
      type: String,
      default: "Nenhum telefone foi informado.",
    },
    bio: {
      type: String,
      default: "Nenhuma biografia foi informada.",
      maxLength: [250, "A biografia não dever conter mais que 250 caracteres."],
    },
    password: {
      type: String,
      required: [true, "Por favor, adicione uma senha"],
      minLength: [6, "A senha dever conter no mínimo 6 caracteres."],
    },
    role: {
      type: String,
      enum: ["admin", "worker"],
      required: true,
    },
    workerFunction: {
      type: String,
      enum: ["Caixa", "Almoxarifado", "Barraca", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor, adicione um nome."],
    },
    email: {
      type: String,
      required: [true, "Por favor, adicione um email."],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Por favor, adicione um email válido.",
      ],
    },
    photo: {
      type: String,
      require: [true, "Por favor, adicione uma foto."],
      default:
        "https://res.cloudinary.com/dpyrlntco/image/upload/v1682021547/avatar_ilj8xe.png",
    },
    phone: {
      type: String,
      default: "Nenhum telefone foi informado.",
    },
    bio: {
      type: String,
      default: "Nenhuma biografia foi informada.",
      maxLength: [250, "A biografia não dever conter mais que 250 caracteres."],
    },
    password: {
      type: String,
      required: [true, "Por favor, adicione uma senha."],
      minLength: [6, "A senha dever conter no mínimo 6 caracteres."],
    },
    role: {
      type: String,
      default: "master",
    },
    subaccounts: [subaccountSchema],
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// Encrypt password before saving to DB for subaccountSchema
subaccountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

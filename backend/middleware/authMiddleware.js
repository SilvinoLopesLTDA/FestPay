const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Não autorizado, por favor entre em sua conta");
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      res.status(401);
      throw new Error("Token JWT inválido");
    }

    const subaccountUser = await User.findOne({
      "subaccounts._id": verified.id,
    }).select("-password");

    if (subaccountUser) {
      const subaccountId = verified.id;
      req.subaccount = subaccountUser.subaccounts.find(
        (sub) => sub._id.toString() === subaccountId
      );
      next();
    } else {
      const masterUser = await User.findById(verified.id).select("-password");
      if (masterUser) {
        req.user = masterUser;
        next();
      } else {
        res.status(401);
        throw new Error("Usuário não encontrado");
      }
    }
  } catch (error) {
    res.status(401);
    throw new Error("Não autorizado, por favor entre em sua conta");
  }
});

module.exports = protect;

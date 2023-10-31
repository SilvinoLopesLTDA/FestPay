const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");
const Purchase = require("../models/purchaseModel");
const Shop = require("../models/shopModel");

const qrCodeReader = asyncHandler(async (req, res) => {
  try {
    const qrCodeData = req.body.qrCodeData;
    const db_client = await Client.findOne({ qrCode: qrCodeData });

    if (!db_client) {
      return res.status(404).json({ message: "QR Code não encontrado" });
    }

    const formattedData = {
      name: db_client.name,
      phone: db_client.phone,
      email: db_client.email,
      paymentMethod: db_client.paymentMethod,
      balance: db_client.balance,
    };

    return res.json(formattedData);
  } catch (error) {
    console.error("Erro ao processar a leitura do QR Code", error);
    return res
      .status(500)
      .json({ message: "Erro ao processar a leitura do QR Code" });
  }
});

const qrCodeRecharge = asyncHandler(async (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const { qrCodeData, rechargeAmount, paymentMethod, email } = req.body;

    const client = await Client.findOne({ email: email });
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    client.paymentMethod = paymentMethod;
    client.balance += rechargeAmount;
    await client.save();

    const purchase = new Purchase({
      shop: client.shop,
      user: client.user,
      items: [
        {
          name: "Recarga",
          price: rechargeAmount,
          quantity: 1,
        },
      ],
      profitValue: rechargeAmount,
    });
    await purchase.save();

    return res.json({ message: "Recarga bem-sucedida" });
  } catch (error) {
    console.error("Erro ao processar a recarga do QR Code", error);
    return res
      .status(500)
      .json({ message: "Erro ao processar a recarga do QR Code" });
  }
});

const qrCodePurchase = asyncHandler(async (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const { qrCodeData, purchaseAmount, email, name } = req.body;
    const userId = req.subaccount ? req.subaccount.user : req.user.id;

    if (!name || !email || !purchaseAmount) {
      res.status(400);
      throw new Error("Preencha os campos corretamente.");
    }

    const client = await Client.findOne({ email: email });
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const shop = await Shop.findOne({ name: name, user: userId });
    if (!shop) {
      return res.status(404).json({ message: "Barraca não encontrada" });
    }

    if (client.balance < purchaseAmount) {
      return res
        .status(400)
        .json({ message: "Saldo insuficiente para realizar a compra" });
    }

    client.balance -= purchaseAmount;
    await client.save();

    shop.profit += purchaseAmount;
    await shop.save();

    return res.json({ message: "Compra bem-sucedida" });
  } catch (error) {
    console.error("Erro ao processar a compra do QR Code", error);
    return res.status(500).json({
      message: "Erro ao processar a compra do QR Code",
      error: error.message,
    });
  }
});

module.exports = { qrCodeReader, qrCodeRecharge, qrCodePurchase };

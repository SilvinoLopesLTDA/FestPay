// Importe os módulos necessários
const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");
const Shop = require("../models/shopModel");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Função para salvar a imagem em base64 no Cloudinary
const saveBase64ImageToCloudinary = async (base64String, fileName) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "FestPay",
      public_id: fileName,
      overwrite: true,
    });
    return result.secure_url; // Retorna a URL da imagem salva no Cloudinary
  } catch (error) {
    console.error("Erro ao salvar a imagem no Cloudinary:", error);
    throw error;
  }
};

const qrCodeReader = asyncHandler(async (req, res) => {
  try {
    // Obtenha os dados do QR Code lido
    const qrCodeData = req.body.qrCodeData;

    // Verifique se o QR Code existe no banco de dados
    const db_client = await Client.findOne({ qrCode: qrCodeData });
    if (!db_client) {
      return res.status(404).json({ message: "QR Code não encontrado" });
    }

    // Formate os dados para retorno
    const formattedData = {
      name: db_client.name,
      phone: db_client.phone,
      email: db_client.email,
      paymentMethod: db_client.paymentMethod,
      balance: db_client.balance,
    };

    // Salve a imagem no Cloudinary
    const fileName = `${db_client.name}-${db_client.email}`;
    const cloudinaryImageUrl = await saveBase64ImageToCloudinary(
      qrCodeData,
      fileName
    );

    const mailOptions = {
      from: "FestPay 🎉 <festpay@gmx.com>",
      to: db_client.email,
      subject: "Aqui está o seu QR Code!",
      text: "Aqui está o seu QR Code pré-pago! Qualquer problema ou falta de saldo procure o Guichê mais perto; é um prazer te ter aqui!",
      attachments: [
        {
          filename: "qr-code.jpg",
          path: cloudinaryImageUrl,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erro ao enviar o email:", error);
        return res.status(500).json({ message: "Erro ao enviar o email" });
      }
      console.log("Email enviado:", info.response);
    });

    // Retorne os dados formatados
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
    // Obtenha os dados do QR Code, como o valor a ser recarregado e o identificador do cliente
    // eslint-disable-next-line no-unused-vars
    const { qrCodeData, rechargeAmount, paymentMethod, email } = req.body;

    // Encontre o cliente correspondente no banco de dados
    const client = await Client.findOne({ email: email });
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    // Atualize o saldo do cliente no banco de dados
    client.paymentMethod = paymentMethod;
    client.balance += rechargeAmount;
    await client.save();

    // Retorne uma resposta indicando que a recarga foi bem-sucedida
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
    // Obtenha os dados do QR Code, como o valor da compra e o identificador do cliente
    // eslint-disable-next-line no-unused-vars
    const { qrCodeData, purchaseAmount, email, name } = req.body;

    // Encontre o cliente correspondente no banco de dados
    const client = await Client.findOne({ email: email });
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    // Encontre a barraca correspondente no banco de dados
    const shop = await Shop.findOne({ name: name });
    if (!shop) {
      return res.status(404).json({ message: "Barraca não encontrada" });
    }

    // Verifique se o saldo do cliente é suficiente para realizar a compra
    if (client.balance < purchaseAmount) {
      return res
        .status(400)
        .json({ message: "Saldo insuficiente para realizar a compra" });
    }

    // Deduza o valor da compra do saldo do cliente no banco de dados
    client.balance -= purchaseAmount;
    await client.save();

    // Atualize o lucro da barraca
    shop.profit += purchaseAmount;
    await shop.save();

    // Retorne uma resposta indicando que a compra foi bem-sucedida
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

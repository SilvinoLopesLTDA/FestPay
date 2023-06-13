const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const clientTwilio = require("twilio")(accountSid, authToken);

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

// Register Client
const registerClient = asyncHandler(async (req, res) => {
  const { name, phone, email, paymentMethod, balance } = req.body;

  // Validation
  if (!name || !email || !paymentMethod || !balance) {
    res.status(400);
    throw new Error("Preencha os campos corretamente.");
  }

  // Check if client already exist
  const clientExists = await Client.findOne({ email });

  if (clientExists) {
    res.status(400);
    throw new Error("O cliente já está cadastrado!");
  }

  // Create new client
  const client = await Client.create({
    name,
    phone,
    email,
    paymentMethod,
    balance,
  });

  if (client) {
    const { _id, name, phone, paymentMethod, qrCode } = client;

    // Salve a imagem no Cloudinary
    const fileName = `${name}-${email}`;
    const cloudinaryImageUrl = await saveBase64ImageToCloudinary(
      qrCode,
      fileName
    );

    const mailOptions = {
      from: "FestPay 🎉 <festpay@gmx.com>",
      to: email,
      subject: "Seja bem-vindo(a) à festa!",
      text: "Ficamos muito felizes de ter você por aqui! Este é o seu QR Code pré-pago, onde você irá utilizar como uma ficha, mas, digital! Qualquer problema ou falta de saldo procure o Guichê mais perto; é um prazer te ter aqui!",
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

    clientTwilio.messages
      .create({
        body: "Aqui está o seu QR Code!",
        mediaUrl: cloudinaryImageUrl,
        from: "whatsapp:+14155238886",
        to: `whatsapp:${phone}`,
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.error("Erro ao enviar a mensagem:", error));

    clientTwilio.messages
      .create({
        body: "Aqui está o seu QR Code!",
        mediaUrl: cloudinaryImageUrl,
        from: "+14155238886",
        to: phone,
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.error("Erro ao enviar a mensagem:", error));

    res.status(201).json({
      _id,
      name,
      phone,
      email,
      paymentMethod,
      balance,
      qrCode,
    });
  } else {
    res.status(400);
    throw new Error("Dados de usuário inválidos!");
  }
});

// Get all Clients
const getClients = asyncHandler(async (req, res) => {
  const client = await Client.find();
  res.status(200).json(client);
});

// Get  a single Client
const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  // If client doesn't exist
  if (!client) {
    res.status(404);
    throw new Error("Client não encontrado.");
  }
  res.status(200).json(client);
});

// Delete Client
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  // If client doesn't exist
  if (!client) {
    res.status(404);
    throw new Error("Client não encontrado.");
  }
  await client.remove();
  res.status(200).json(client);
});

// Update Client
const updateClient = asyncHandler(async (req, res) => {
  const { name, phone, email, paymentMethod, balance } = req.body;
  const { id } = req.params;
  const client = await Client.findById(id);

  // If client doesn't exist
  if (!client) {
    res.status(404);
    throw new Error("Cliente não encontrado.");
  }

  // Update Client
  const updatedClient = await Client.findByIdAndUpdate(
    { _id: id },
    {
      name,
      phone,
      email,
      paymentMethod,
      balance,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedClient);
});

module.exports = {
  registerClient,
  getClients,
  getClient,
  deleteClient,
  updateClient,
};

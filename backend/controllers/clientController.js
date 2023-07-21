const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const QRCode = require("qrcode");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

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

const saveBase64ImageToCloudinary = async (base64String, fileName) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "FestPay",
      public_id: fileName,
      overwrite: true,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Erro ao salvar a imagem no Cloudinary:", error);
    throw error;
  }
};

const generateQRCode = async (data) => {
  try {
    const qrCode = await QRCode.toDataURL(data);
    return qrCode;
  } catch (error) {
    console.error("Erro ao gerar o QR Code:", error);
    throw error;
  }
};

const registerClient = asyncHandler(async (req, res) => {
  const { name, phone, email, paymentMethod, balance } = req.body;

  if (!name || !email || !paymentMethod || !balance) {
    res.status(400);
    throw new Error("Preencha os campos corretamente.");
  }

  const clientExists = await Client.findOne({ email });

  if (clientExists) {
    res.status(400);
    throw new Error("O cliente já está cadastrado!");
  }

  const qrCodeData = {
    name,
    phone,
    email,
    paymentMethod,
    balance,
  };
  const qrCode = await generateQRCode(JSON.stringify(qrCodeData));

  const fileName = `${name}-${email}`;
  const cloudinaryImageUrl = await saveBase64ImageToCloudinary(
    qrCode,
    fileName
  );

  const client = await Client.create({
    user: req.user.id,
    name,
    phone,
    email,
    paymentMethod,
    balance,
    qrCode: cloudinaryImageUrl,
  });

  const token = generateToken(client._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (client) {
    const { _id, name, phone, paymentMethod } = client;

    const resetUrl = `${process.env.FRONTEND_URL}/client-info/${_id}`;

    const mailOptions = {
      from: "FestPay 🎉 <festpay49@gmail.com>",
      to: email,
      subject: "Seja bem-vindo(a) à festa!",
      text: `
        Ficamos muito felizes de ter você por aqui! Este é o seu QR Code pré-pago, onde você irá utilizar como uma ficha, mas, digital! Qualquer problema ou falta de saldo procure o Guichê mais perto; é um prazer te ter aqui! 
        
        Deseja saber o seu saldo atual? acesse o link abaixo:

        ${resetUrl}
      `,
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
      token,
    });
  } else {
    res.status(400);
    throw new Error("Dados de usuário inválidos!");
  }
});

// Get Client Token Status
const ClientToken = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// Get all Clients
const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ user: req.user.id });
  res.status(200).json(clients);
});

// Get a single Client
const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  // If client doesn't exist
  if (!client) {
    res.status(404);
    throw new Error("Client não encontrado.");
  }
  // Match product with User
  if (client.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Usuário não autorizado!");
  }
  res.status(200).json(client);
});

// Get Client Info
const getClientInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const client = await Client.findById(id);

  // If client doesn't exist
  if (!client) {
    res.status(404);
    throw new Error("Cliente não encontrado.");
  }

  res.status(200).json(client);
});

// Delete Client
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  // If client doesn't exist
  if (!client) {
    res.status(404);
    throw new Error("Cliente não encontrado.");
  }
  // Match product with User
  if (client.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error({ message: "Cliente Deletado com Sucesso." });
  }
  await client.remove();
  res.status(200).json(client);
});

// Update Client
const updateClient = asyncHandler(async (req, res) => {
  const { name, phone, email, paymentMethod, balance, qrCode } = req.body;
  const { id } = req.params;
  const client = await Client.findById(id);

  // If client doesn't exist
  if (!client) {
    res.status(404);
    throw new Error("Cliente não encontrado.");
  }

  // Match product to the User
  if (client.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error({ message: "Cliente Deletado com Sucesso." });
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
      qrCode,
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
  ClientToken,
  getClients,
  getClient,
  getClientInfo,
  deleteClient,
  updateClient,
};

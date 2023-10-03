const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const QRCode = require("qrcode");

const {
  CLOUD_NAME,
  API_KEY,
  API_SECRET,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  FRONTEND_URL,
  JWT_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const clientTwilio = require("twilio")(accountSid, authToken);

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const saveBase64ImageToCloudinary = async (base64String, fileName) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "FestPay/qrCodes",
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

  const clientExists = await Client.findOne({ user: req.user.id, email });

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

  if (client) {
    const { _id, name, phone, email, paymentMethod, balance, qrCode } = client;
    const replacePhone = phone.replace(/[^\d]/g, "");
    const formattedPhone = `+55${replacePhone}`;
    const resetUrl = `${FRONTEND_URL}/client-info/${_id}`;

    const mailOptions = {
      from: "FestPay 🎉 <festpay49@gmail.com>",
      to: email,
      subject: "Seja bem-vindo(a) à festa!",
      html: `
          <!DOCTYPE html>
          <html>
          <head>
              <title>Seja bem-vindo(a) à festa! 🎉</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                  }
      
                  .header {
                      background-color: #1e1b4b;
                      color: #fff;
                      padding: 20px;
                      text-align: center;
                  }
      
                  .content {
                      padding: 20px;
                  }
  
                  .content h4 {
                      font-size: 20px;
                  }
  
                  .content h5 {
                      font-size: 18px;
                      margin: 17px 0 0 0;
                  }
      
                  p {
                      font-size: 14px;
                  }
      
                  ul {
                      list-style-type: none;
                      padding: 0;
                      margin: 15px 0;
                  }
      
                  li {
                      margin-bottom: 10px;
                  }
      
                  strong {
                      font-weight: bold;
                  }
      
                  hr {
                      margin: 30px 0;
                  }
      
                  .footer {
                      background-color: #1e1b4b;
                      color: #fff;
                      padding: 10px;
                      text-align: center;
                  }
              </style>
          </head>
          <body>
              <div class="header">
                  <h2>Olá, seja bem-vindo(a) à festa!</h2>
              </div>
          
              <div class="content">
                  <h4>Ficamos muito felizes de tê-lo(a) conosco!</h4>
                  <p>Este é o seu QR Code pré-pago, que você usará como uma ficha digital durante a festa. Não hesite em procurar o guichê mais próximo se precisar de assistência ou recarga de saldo.</p>
                  <p>Para verificar seu saldo atual, clique no link abaixo:</p>
      
                  <a href="${resetUrl}">${resetUrl}</a>
              </div>
      
              <div class="footer">
                  <p>Atenciosamente,</p>
                  <p>Equipe FestPay 🎉</p>
              </div>
          </body>
          </html>
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
        to: `whatsapp:${formattedPhone}`,
      })
      .then((message) =>
        console.log(
          "SID: " +
            message.sid +
            "\nStatus: " +
            message.status +
            "\nPara: " +
            message.to
        )
      )
      .catch((error) => console.error("Erro ao enviar a mensagem:", error));

    clientTwilio.messages
      .create({
        body: "Aqui está o seu QR Code!",
        mediaUrl: cloudinaryImageUrl,
        from: "+13612735460",
        to: formattedPhone,
      })
      .then((message) =>
        console.log(
          "SID: " +
            message.sid +
            "\nStatus: " +
            message.status +
            "\nPara: " +
            message.to
        )
      )
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

// Get Client Token Status
const ClientToken = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, JWT_SECRET);

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

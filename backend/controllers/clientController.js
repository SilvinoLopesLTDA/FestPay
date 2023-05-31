const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");

// Register Client
const registerClient = asyncHandler(async (req, res) => {
  const { name, phone, paymentMethod, credits } = req.body;

  // Validation
  if (!name || !phone || !paymentMethod || !credits) {
    res.status(400);
    throw new Error("Preencha os campos corretamente.");
  }

  // Check if client already exist
  const clientExists = await Client.findOne({ phone });

  if (clientExists) {
    res.status(400);
    throw new Error("O cliente já está cadastrado!");
  }

  // Create new client
  const client = await Client.create({
    name,
    phone,
    paymentMethod,
    credits,
  });

  if (client) {
    const { _id, name, phone, paymentMethod, qrCode } = client;
    res.status(201).json({
      _id,
      name,
      phone,
      paymentMethod,
      credits,
      qrCode,
    });
  } else {
    res.status(400);
    throw new Error("Dados de usuário invalidos!");
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
    const { name, phone, paymentMethod, credits } = req.body;
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
        paymentMethod,
        credits
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

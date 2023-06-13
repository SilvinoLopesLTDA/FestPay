const asyncHandler = require("express-async-handler");
const Shop = require("../models/shopModel");

// Create Shop
const createShop = asyncHandler(async (req, res) => {
  const { name, password, profit, cost } = req.body;

  // Validation
  if (!name || !password || !cost) {
    res.status(400);
    throw new Error("Por favor, preencha os campos corretamente!");
  }

  if (password.length > 4) {
    res.status(400);
    throw new Error("A senha não pode conter mais de 4 caracteres!");
  }

  if (password.length < 4) {
    res.status(400);
    throw new Error("A senha não pode conter menos de 4 caracteres!");
  }

  // Create Shop
  const shop = await Shop.create({
    name,
    password,
    profit,
    cost,
  });

  res.status(201).json({ _id: shop._id, name, password, profit, cost });
});

const createItem = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  const id = req.params.id;

  if (!name || !price) {
    res.status(400);
    throw new Error("Por favor, preencha os campos corretamente!");
  }

  const shop = await Shop.findById(id);

  if (!shop) {
    res.status(404);
    throw new Error("Ponto de venda não encontrado.");
  }

  const newItem = {
    name,
    price: parseFloat(price),
  };

  shop.items.push(newItem);
  const updatedShop = await shop.save();

  res.status(201).json(updatedShop);
});

// Get all Shops
const getShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find().sort("-createdAt");
  res.status(200).json(shops);
});

// Get single Shop
const getShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error("Ponto de venda não encontrado.");
  }

  res.status(200).json(shop);
});

// Delete Shop
const deleteShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error("Ponto de venda não encontrado.");
  }

  await shop.remove();
  res.status(200).json(shop);
});

// Delete Item
const deleteItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);

  const shop = await Shop.findOne({ "items._id": itemId });
  console.log(shop);
  if (!shop) {
    res.status(404);
    throw new Error("Ponto de venda não encontrado.");
  }

  // Filtrar os itens do shop, excluindo o item com o ID especificado
  shop.items = shop.items.filter((item) => item._id.toString() !== itemId);

  // Salvar o shop atualizado no banco de dados
  const updatedShop = await shop.save();

  res.status(200).json(updatedShop);
});


// Update Shop
const updateShop = asyncHandler(async (req, res) => {
  const { name, password, profit, cost } = req.body;
  const { id } = req.params;
  const shop = await Shop.findById(id);

  if (!shop) {
    res.status(404);
    throw new Error("Ponto de venda não encontrado.");
  }

  // Atualize os campos do shop
  shop.name = name;
  shop.password = password;
  shop.profit = profit;
  shop.cost = cost;

  // Salve o shop atualizado no banco de dados
  const updatedShop = await shop.save();

  res.status(200).json(updatedShop);
});

module.exports = {
  createShop,
  createItem,
  getShops,
  getShop,
  deleteShop,
  deleteItem,
  updateShop,
};

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
    user: req.user.id,
    name,
    password,
    profit,
    cost,
  });

  res.status(201).json({ _id: shop._id, name, password, profit, cost });
});

const createItem = asyncHandler(async (req, res) => {
  const { name, price, quantity } = req.body;
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
    quantity,
  };

  shop.items.push(newItem);
  const updatedShop = await shop.save();

  res.status(201).json(updatedShop);
});

// Get all Shops
const getShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(shops);
});

// Get single Shop
const getShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error("Ponto de venda não encontrado.");
  }

  if (shop.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Usuário não Autorizado.");
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

  if (shop.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error({ message: "Ponto de venda Deletado com Sucesso." });
  }

  await shop.remove();
  res.status(200).json(shop);
});

// Delete Item
const deleteItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;

  const shop = await Shop.findOne({ "items._id": itemId });

  if (!shop) {
    res.status(404);
    throw new Error("Ponto de venda não encontrado.");
  }

  if (shop.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error({ message: "Ponto de venda Deletado com Sucesso." });
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

const updateItem = asyncHandler(async (req, res) => {
  const { name, price, quantity } = req.body;
  const { shopId, itemId } = req.params;

  // Encontre o Shop pelo ID
  const shop = await Shop.findById(shopId);
  if (!shop) {
    res.status(404);
    throw new Error("Ponto de venda não encontrado.");
  }

  const item = shop.items.find((item) => item._id.toString() === itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item não encontrado.");
  }

  item.name = name;
  item.price = price;
  item.quantity = quantity;

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
  updateItem,
};

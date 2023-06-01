const asyncHandler = require("express-async-handler");
const Shop = require("../models/shopModel");

// Create Shop
const createShop = asyncHandler(async (req, res) => {
  const { name, items, profit, cost } = req.body;

  // Validation
  if (!name || !items || !cost) {
    res.status(400);
    throw new Error("Por favor, preencha os campos corretamente!");
  }

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error("O campo items deve ser um array.");
  }

  const createdItems = items.map((item) => ({
    name: item.name,
    price: parseFloat(item.price),
  }));

  // Create Shop
  const shop = await Shop.create({
    name,
    items: createdItems,
    profit,
    cost,
  });

  res.status(201).json(shop);
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
    throw new Error("Produto não encontrado.");
  }

  await shop.remove();
  res.status(200).json(shop);
});

// Update Shop
const updateShop = asyncHandler(async (req, res) => {
  const { name, items, profit, cost } = req.body;
  const { id } = req.params;
  const shop = await Shop.findById(id);

  if (!shop) {
    res.status(404);
    throw new Error("Ponto de venda não encontrado.");
  }

  const updatedItems = items.map((item) => ({
    name: item.name,
    price: parseFloat(item.price),
  }));

  const updatedShop = await Shop.findByIdAndUpdate(
    { _id: id },
    {
      name,
      items: updatedItems,
      profit,
      cost,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedShop);
});

module.exports = {
  createShop,
  getShops,
  getShop,
  deleteShop,
  updateShop,
};

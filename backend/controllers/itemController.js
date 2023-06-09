const asyncHandler = require("express-async-handler");
const Item = require("../models/itemModel");

// Create Item
const createItem = asyncHandler(async (req, res) => {
  const { name, price } = req.body;

  // Validation
  if (!name || !price) {
    res.status(400);
    throw new Error("Por favor, preencha os campos corretamente!");
  }

  // Create Item
  const item = await Item.create({
    shop: req.shop.id,
    name,
    price,
  });

  res.status(201).json(item);
});

// Get all Items
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find().sort("-createdAt");
  res.status(200).json(items);
});

// Get single Item
const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item não encontrado.");
  }

  res.status(200).json(item);
});

// Delete Item
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item não encontrado.");
  }

  await item.remove();
  res.status(200).json(item);
});

// Update Item
const updateItem = asyncHandler(async (req, res) => {
  const { name, price} = req.body;
  const { id } = req.params;
  const item = await Item.findById(id);

  if (!item) {
    res.status(404);
    throw new Error("Item não encontrado.");
  }

  const updatedItem = await Item.findByIdAndUpdate(
    { _id: id },
    {
      name,
        price,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedItem);
});

module.exports = {
  createItem,
  getItems,
  getItem,
  deleteItem,
  updateItem,
};

const express = require("express");
const router = express.Router();
const {
  createItem,
  getItems,
  getItem,
  deleteItem,
  updateItem,
  placeItemInShop,
  handleUserChoice,
} = require("../controllers/ItemController");
const protect = require("../middleware/authMiddleware");

router.post("/create-item", protect, createItem);
router.get("/", protect, getItems);
router.get("/:id", getItem);
router.delete("/:id", protect, deleteItem);
router.patch("/update-item/:id", updateItem);
router.patch("/place-items/:id", placeItemInShop);
router.patch("/handle-choice/:id", handleUserChoice);

module.exports = router;

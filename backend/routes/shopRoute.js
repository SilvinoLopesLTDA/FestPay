const express = require("express");
const router = express.Router();
const {
  createShop,
  createItem,
  getShops,
  getShop,
  deleteShop,
  deleteItem,
  updateShop,
  updateItem,
} = require("../controllers/shopController");
const protect = require("../middleware/authMiddleware");

router.post("/create-shop", protect, createShop);
router.post("/create-item/:id", protect, createItem);
router.get("/", protect, getShops);
router.get("/:id", protect, getShop);
router.delete("/:id", protect, deleteShop);
router.delete("/delete-item/:id", protect, deleteItem);
router.patch("/:id", protect, updateShop);
router.patch("/update-item/:shopId/:itemId", protect, updateItem);

module.exports = router;

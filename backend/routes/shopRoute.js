const express = require("express");
const router = express.Router();

const {
  createShop,
  createItem,
  getShops,
  getShop,
  deleteShop,
  updateShop,
} = require("../controllers/shopController");

router.post("/create-shop", createShop);
router.post("/create-item/:id", createItem);
router.get("/", getShops);
router.get("/:id", getShop);
router.delete("/:id", deleteShop);
router.patch("/:id", updateShop);

module.exports = router;

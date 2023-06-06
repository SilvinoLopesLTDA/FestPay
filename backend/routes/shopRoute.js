const express = require("express");
const router = express.Router();

const {
    createShop,
    getShops,
    getShop,
    deleteShop,
    updateShop,
} = require("../controllers/shopController");

router.post("/createshop", createShop);
router.get("/", getShops);
router.get("/:id", getShop);
router.delete("/:id", deleteShop);
router.patch("/:id", updateShop);

module.exports = router;
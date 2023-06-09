const express = require("express");
const router = express.Router();

const {
    createItem,
    getItems,
    getItem,
    deleteItem,
    updateItem,
} = require("../controllers/itemController");

router.post("/createitem", createItem);
router.get("/", getItems);
router.get("/:id", getItem);
router.delete("/:id", deleteItem);
router.patch("/:id", updateItem);

module.exports = router;
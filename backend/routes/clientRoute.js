const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  registerClient,
  getClients,
  getClient,
  deleteClient,
  updateClient,
  ClientToken,
} = require("../controllers/clientController");

router.post("/register", protect, registerClient);
router.get("/", protect, getClients);
router.get("/clienttoken", protect, ClientToken);
router.get("/:id", protect, getClient);
router.delete("/:id", protect, deleteClient);
router.patch("/:id", protect, updateClient);

module.exports = router;

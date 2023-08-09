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
  getClientInfo,
} = require("../controllers/clientController");

router.post("/register", protect, registerClient);
router.get("/", protect, getClients);
router.get("/client-token", protect, ClientToken);
router.get("/:id", protect, getClient);
router.get("/client-info/:id", getClientInfo);
router.delete("/:id", protect, deleteClient);
router.patch("/:id", protect, updateClient);

module.exports = router;

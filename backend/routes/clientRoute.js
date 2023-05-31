const express = require("express");
const router = express.Router();

const {
  registerClient,
  getClients,
  getClient,
  deleteClient,
  updateClient,
} = require("../controllers/clientController");

router.post("/register", registerClient);
router.get("/", getClients);
router.get("/:id", getClient);
router.delete("/:id", deleteClient);
router.patch("/:id", updateClient);

module.exports = router;

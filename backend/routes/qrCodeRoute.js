const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  qrCodeReader,
  qrCodePurchase,
  qrCodeRecharge,
} = require("../controllers/qrCodeController");

router.post("/read", protect, qrCodeReader);
router.post("/purchase", protect, qrCodePurchase);
router.post("/recharge", protect, qrCodeRecharge);

module.exports = router;

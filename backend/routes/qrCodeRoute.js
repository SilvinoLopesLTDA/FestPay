const express = require("express");
const router = express.Router();
const {
  qrCodeReader,
  qrCodePurchase,
  qrCodeRecharge,
} = require("../controllers/qrCodeController");

router.post("/read", qrCodeReader);
router.post("/purchase", qrCodePurchase);
router.post("/recharge", qrCodeRecharge);

module.exports = router;

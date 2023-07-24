const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  logout,
  getAdmins,
  getAdmin,
  loginStatus,
  deleteAdmin,
  updateAdmin,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");

router.post("/register", protect, registerAdmin);
router.get("/", protect, getAdmins);
router.get("/:id", getAdmin);
router.delete("/:id", protect, deleteAdmin);
router.patch("/updateadmin/:id", updateAdmin);

router.post("/login/:id", loginAdmin);
router.get("/logout", logout);
router.get("/loggedin", loginStatus);
router.patch("/changepassword/:id", changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  getAdmins,
  getAdmin,
  deleteAdmin,
  updateAdmin,
  createPassword
} = require("../controllers/adminController");
const {
  loginAdmin,
  logout,
  loginStatus,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/adminLogableController");
const protect = require("../middleware/authMiddleware");

router.post("/register", protect, registerAdmin);
router.get("/", protect, getAdmins);
router.get("/:id", getAdmin);
router.delete("/:id", protect, deleteAdmin);
router.patch("/updateadmin/:id", updateAdmin);
router.post("/createpassword/:id", createPassword);

router.post("/login/:id", loginAdmin);
router.get("/logout", logout);
router.get("/loggedin", loginStatus);
router.patch("/changepassword/:id", changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;

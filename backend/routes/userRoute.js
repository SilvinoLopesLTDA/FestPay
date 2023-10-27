const express = require("express");
const router = express.Router();
const {
  registerSubaccount,
  registerUser,
  loginUser,
  logout,
  getUser,
  listSubaccounts,
  getSubaccountById,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  updateSubaccount,
  deleteSubaccount,
  confirmEmail,
  deleteAccount,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/register-subaccount", protect, registerSubaccount);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/confirm-email/:token", confirmEmail);
router.get("/logout", logout);
router.get("/get-user", protect, getUser);
router.get("/get-subaccounts", protect, listSubaccounts);
router.get("/get-subaccount/:id", protect, getSubaccountById);
router.get("/loggedin", loginStatus);
router.patch("/update-subaccount/:id", protect, updateSubaccount);
router.patch("/update-user", protect, updateUser);
router.patch("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.delete("/delete-subaccount/:id", protect, deleteSubaccount);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;

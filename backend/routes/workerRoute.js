const express = require("express");
const router = express.Router();
const {
  registerWorker,
  getWorkers,
  getWorker,
  deleteWorker,
  updateWorker,
} = require("../controllers/workerController");
const protect = require("../middleware/authMiddleware");

router.post("/register", protect, registerWorker);
router.get("/", protect, getWorkers);
router.get("/:id", getWorker);
router.delete("/:id", protect, deleteWorker);
router.patch("/updateworker/:id", updateWorker);

module.exports = router;

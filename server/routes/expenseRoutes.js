const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");


const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getTotalExpense,
  getCategoryTotals
} = require("../controllers/expenseController");

router.post("/", protect, addExpense);
router.get("/", protect, getExpenses);
router.get("/total", protect, getTotalExpense);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);
router.get("/category-totals", protect, getCategoryTotals);


module.exports = router;

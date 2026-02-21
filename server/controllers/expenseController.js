const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || new Date(),
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Expenses with pagination
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 5, category, month } = req.query;

    const filter = { user: userId };

    // Filter by category
    if (category) filter.category = category;

    // Filter by month
    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Total Expense
exports.getTotalExpense = async (req, res) => {
  try {
    const total = await Expense.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    res.json({
      total: total.length > 0 ? total[0].totalAmount : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Category Totals
exports.getCategoryTotals = async (req, res) => {
  try {
    const totals = await Expense.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
    ]);

    res.json(totals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
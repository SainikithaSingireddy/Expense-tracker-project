const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


// Connect Database
connectDB();

// Routes
app.use("/api/expenses", expenseRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

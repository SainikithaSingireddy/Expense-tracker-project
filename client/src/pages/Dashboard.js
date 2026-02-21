import React, { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ExpenseChart from "../components/ExpenseChart";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await API.get(`/expenses?page=${page}&limit=5`);
      setExpenses(res.data.expenses || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setExpenses([]);
    }
  }, [page]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmitExpense = async (e) => {
    e.preventDefault();

    try {
      if (editingExpense) {
        await API.put(`/expenses/${editingExpense._id}`, {
          title,
          amount,
          category,
          date,
        });
        setEditingExpense(null);
      } else {
        await API.post("/expenses", {
          title,
          amount,
          category,
          date,
        });
      }

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const handleEdit = (exp) => {
    setEditingExpense(exp);
    setTitle(exp.title);
    setAmount(exp.amount);
    setCategory(exp.category);
    setDate(exp.date?.substring(0, 10));
  };

  const totalAmount = expenses.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );

  const categoryTotals = {};
  expenses.forEach((exp) => {
    if (!categoryTotals[exp.category]) categoryTotals[exp.category] = 0;
    categoryTotals[exp.category] += Number(exp.amount);
  });

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h2 className="dashboard-title">Your Expenses</h2>

        <div className="card">
          <h3>Total Expenses</h3>
          <h2>₹ {totalAmount}</h2>
        </div>

        <div className="card">
          <ExpenseChart expenses={expenses} />
        </div>

        <div className="card">
          <h3>Category Summary</h3>
          {Object.keys(categoryTotals).length === 0 ? (
            <p>No data available</p>
          ) : (
            Object.keys(categoryTotals).map((cat) => (
              <p key={cat}>
                {cat}: ₹ {categoryTotals[cat]}
              </p>
            ))
          )}
        </div>

        <div className="card">
          <form onSubmit={handleSubmitExpense} className="add-expense-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <button type="submit">
              {editingExpense ? "Update Expense" : "Add Expense"}
            </button>
          </form>
        </div>

        {expenses.map((exp) => (
          <div key={exp._id} className="expense-item">
            <div>
              <h4>{exp.title}</h4>
              <p>₹ {exp.amount}</p>
              <p>{exp.category}</p>
            </div>

            <div className="expense-actions">
              <button
                className="edit-btn"
                onClick={() => handleEdit(exp)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(exp._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span>{page}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
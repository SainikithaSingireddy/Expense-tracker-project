import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";


const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Welcome to Expense Tracker💰</h1>
        <p>Track your expenses and manage your budget easily.</p>

        <div className="home-buttons">
          <Link to="/login">
            <button>Login</button>
          </Link>

          <Link to="/register">
            <button className="secondary">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

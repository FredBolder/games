import { Link } from 'react-router-dom';
import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="loginNavbar">
      <div className="logo">
        <h1>Games</h1>
      </div>
      <div className="nav-links">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Navbar;

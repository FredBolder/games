import React from "react";
import Navbar from "./Navbar";
import { NavLink, useNavigate } from 'react-router-dom';

function Page() {
  const navigate = useNavigate();

  function login(e) {
    navigate("/login");
  }

  function register(e) {
    navigate("/register");
  }

  return (
    <div className="pageContainer">
      <Navbar />
      <div className="mainBody">
        <div className="hero-content">
          <h1 className="hero-title">The Journey Begins Here</h1>
          <div className="btn-container">
            <button className="btn btn-primary" onClick={login}>Login</button>
            <button className="btn btn-primary" onClick={register}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;

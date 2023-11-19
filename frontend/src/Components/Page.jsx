import React from "react";
import Navbar from "./Navbar";
import { NavLink, useNavigate } from "react-router-dom";

function Page() {
  const navigate = useNavigate();

  function login(e) {
    navigate("/login");
  }

  function register(e) {
    navigate("/register");
  }

  return (
    <div className="page">
      <header>
        <Navbar />
      </header>
      <main>
        <h1 className="title">The Journey Begins Here</h1>
        <div className="button-container">
          <button className="button" onClick={login}>
            Login
          </button>
          <button className="button" onClick={register}>
            Register
          </button>
        </div>
      </main>
    </div>
  );
}

export default Page;

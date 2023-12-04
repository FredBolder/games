import React from "react";
import Navbar from "./Navbar";
import Footer from "../Components/Footer";
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
      <main>
        <header>
          <Navbar />
        </header>
        <div className="pageInfo">
          <h1 className="title">The Journey Begins Here</h1>
          <div className="button-container">
            <button className="button" onClick={login}>
              Login
            </button>
            <button className="button" onClick={register}>
              Register
            </button>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Page;

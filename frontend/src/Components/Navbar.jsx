import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import { useContext } from "react";
import InfoContext from "../Context/InfoContext";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const { setLoggedIn, loggedIn } = useContext(InfoContext);

  function credentials() {
    return import.meta.env.VITE_NODE_ENV !== "development";
  }

  async function logout() {
    setLoggedIn(false);
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/users/logout`,
        { withCredentials: credentials() }
      );
    } catch (error) {
      alert(error);
    }
  }

  function aboutClick(e) {
    navigate("/about");
  }

  function logoutClick(e) {
    logout();
  }

  function balClick(e) {
    navigate("/bal");
  }

  function tennisClick(e) {
    navigate("/tennis");
  }

  return (
    <div className="navbar">
      <div className="logo">
        <h1>Games</h1>
      </div>

      {loggedIn ? (
        <div className="gameButtons">
          <button className="button" onClick={balClick}>
            {" "}
            Bal
          </button>
          <button className="button" onClick={tennisClick}>
            Tennis
          </button>
        </div>
      ) : (
        <div></div>
      )}
      {loggedIn ? (
        <div className="nav-links">
          <Link onClick={aboutClick} to="/about">
            About
          </Link>
          <Link onClick={logoutClick} to="/login">
            Logout
          </Link>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/register">Register</Link>
          <Link to="/Login">Login</Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;

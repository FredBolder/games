import React from "react";
import { Link, Outlet } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import InfoContext from "../Context/InfoContext";
import Navbar from "./Navbar";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const { setLoggedIn, loggedIn } = useContext(InfoContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userCredentials = {
        email: e.target["email"].value,
        password: e.target["password"].value,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/users/login`,
        userCredentials
      );
      setLoggedIn(true);
      navigate("/bal");
    } catch (err) {
      //console.log(err);
      alert(err);
    }
  };

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <div className="loginBox">
          <div className="loginBoxInfo">
            <div className="loginBoxInfos">
              <div>
                <h3>Login Here:</h3>
              </div>
              <div>
                <form onSubmit={submitHandler}>
                  <p>Email:</p>
                  <input name="email" type="email" />
                  <p>Password:</p>
                  <input name="password" type="password" />
                  <br />
                  <input type="submit" value="Login" className="button" />
                </form>
              </div>
            </div>
            <div className="loginBoxInfos">
              <h3>If you don't have an account yet:</h3>
              <p>
                To fully use our site, you need to make an account, what only
                takes 2 minutes.
              </p>
              <p>To make an account, click here:</p>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default LoginPage;

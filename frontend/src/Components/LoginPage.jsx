import React from "react";
import { Link, Outlet } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import InfoContext from "../Context/InfoContext";
import Navbar from "./Navbar";
import axios from "axios";
import Footer from "./Footer";
import Tennis from "../Images/tennis.svg";

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
      let msg = "Error while logging in!";
      if (err.message) {
        msg = err.message;
      }
      if (err.response){
        if (err.response.status === 401) {
          msg = "Invalid email address and/or password!";
        }
      }
      alert(msg);
    }
  };

  function register(e) {
    navigate("/register");
  }

  return (
    <>
      <main>
        <header>
          <Navbar />
        </header>
        <div className="loginBox">
          <div className="loginBoxInfo loginBoxOne">
            <div>
              <h3>Login:</h3>
            </div>
            <div>
              <form onSubmit={submitHandler}>
                <p className="form-label">Email:</p>
                <input name="email" type="email" />
                <p className="form-label">Password:</p>
                <input name="password" type="password" />
                <br />
                <div className="loginSubmit">
                  <input type="submit" value="Login" className="button" />
                </div>
              </form>
            </div>
          </div>
          <div className="loginBoxInfo loginBoxTwo">
            <div className="loginBoxInfos">
              <div>
                <h3>If you haven't signed up with us yet:</h3>
                <p>
                  Unlock the full potential of our site by creating an account.
                  It's a breeze and takes just a couple of minutes.
                </p>
                <p>Ready to get started? Click the button below to register:</p>
                <div className="loginToRegister">
                  <button className="button" onClick={register}>
                    Register
                  </button>
                </div>
              </div>
            </div>
            <div className="loginBoxInfos">
              <div className="loginPicture">
                <img src={Tennis} alt="Tennis" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default LoginPage;

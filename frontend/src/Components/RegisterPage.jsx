import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { fixUserData, validateUserData } from "../utils";
import imgRedBig from "../Images/red_ball_big.svg";

function RegisterPage() {
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    let msg = "";

    e.preventDefault();
    try {
      const userData = {
        firstName: e.target["firstName"].value,
        userName: e.target["userName"].value,
        email: e.target["email"].value,
        password: e.target["password"].value,
        password2: e.target["password2"].value,
      };
      fixUserData(userData);
      msg = validateUserData(userData);
      if (msg !== "") {
        throw new Error(msg);
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/users/register`,
        userData
      );
      if (response.status === 200) {
        alert(response.data);
      } else {
        navigate("/login");
        alert("User Registered Succesfully!");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <main>
        <header>
          <Navbar />
        </header>
        <div className="registerBox">
          <div className="registerBoxInfo">
            <div className="registerBoxInfos">
              <div className="registerHeader">
                <h3>Register Here:</h3>
              </div>
              <div className="registerForm">
                <form onSubmit={submitHandler}>
                  <p className="form-label">First Name:</p>
                  <input type="text" name="firstName" />
                  <p className="form-label">Username:</p>
                  <input type="text" name="userName" />
                  <p className="form-label">Email:</p>
                  <input type="email" name="email" />
                  <p className="form-label">Password:</p>
                  <input type="password" name="password" />
                  <p className="form-label">Confirm Password:</p>
                  <input type="password" name="password2" />
                  <br />
                  <div className="registerSubmit">
                    <input type="submit" value="Register" className="button" />
                  </div>
                </form>
              </div>
            </div>

            <div className="loginBoxInfos">
              <div className="registerPhoto">
                <img src={imgRedBig} alt="Red Ball" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default RegisterPage;

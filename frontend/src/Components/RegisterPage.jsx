import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

function RegisterPage() {
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        firstName: e.target["firstName"].value,
        userName: e.target["userName"].value,
        email: e.target["email"].value,
        password: e.target["password"].value,
        password2: e.target["password2"].value,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/users/register`,
        userData
      );
      navigate("/login");
      alert("User Registered Succesfully!");
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
              <div className="registerHeader">
                <h3>Register Here:</h3>
              </div>
              <div className="registerForm">
                <form onSubmit={submitHandler}>
                  <p className="form-label">First Name:</p>
                  <input type="text" name="firstName" className="form-input" />
                  <p className="form-label">Username:</p>
                  <input type="text" name="userName" className="form-input" />
                  <p className="form-label">Email:</p>
                  <input type="email" name="email" className="form-input" />
                  <p className="form-label">Password:</p>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                  />
                  <p className="form-label">Confirm Password:</p>
                  <input
                    type="password"
                    name="password2"
                    className="form-input"
                  />
                  <br />
                  <input type="submit" value="Register" className="button" />
                </form>
              </div>
            </div>

            <div className="alternate-LoginBox">
              <div className="social-register">
                <h3>Register also with your Google account:</h3>
                <p>Here will be Google window</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default RegisterPage;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
                  <div className="registerSubmit">
                    <input type="submit" value="Register" className="button" />
                  </div>
                </form>
              </div>
            </div>

            <div className="alternate-LoginBox">
              <div className="social-register">
                <h3>Here will be the picture to add:</h3>
                <p>Picture that i will make on monday</p>
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

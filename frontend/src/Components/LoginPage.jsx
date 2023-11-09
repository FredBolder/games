import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  return (
    <>
      <div className="loginBody">
        <div className="loginBox">
          <div className="loginBoxInfo">
            <div className="loginBoxInfos">
              <div>
                <h3>Login Here:</h3>
              </div>
              <div>
                <form action="">
                  <p>Email:</p>
                  <input type="email" />
                  <p>Password:</p>
                  <input type="password" />
                  <br />
                  <input type="submit" value="Login" />
                </form>
              </div>
            </div>
            <div className="loginBoxInfos">
              <h3>If you don't have an account yet:</h3>
              <p>To fully use our site, you need to make an account,</p>
              <p>what only takes 2 minutes.</p>
              <p>To make an account, click here:</p>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

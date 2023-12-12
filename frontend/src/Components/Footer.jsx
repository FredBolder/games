import React from "react";
import PrivacyPolicy from "./PrivacyPolicy";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className="footerContainer">
        <div className="footerInfo">
          <div></div>
          <p>Site made as a project for educational purposes | DCI 2023</p>
          <div>
            <Link to="/policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;

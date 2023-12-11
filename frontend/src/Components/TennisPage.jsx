import React from "react";
import { useRef, useEffect, useState, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
// https://www.npmjs.com/package/react-confirm-alert
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function TennisPage() {
  return (
    <div className="page">
      <main>
        <header>
          <Navbar />
        </header>
        <div className="title">Tennis</div>
          <canvas>
            <p>Tennis</p>
          </canvas>
        <Footer />
      </main>
    </div>
  );
}

export default TennisPage;

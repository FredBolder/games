import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Page from "./Components/Page";
import RegisterPage from "./Components/RegisterPage";
import LoginPage from "./Components/LoginPage";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
      {/* <Navbar></Navbar>
				<Page></Page>
				<RegisterPage></RegisterPage>
				<Footer></Footer> */}
      <LoginPage></LoginPage>
    </>
  );
}

export default App;

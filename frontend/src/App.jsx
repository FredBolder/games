import { useState } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import PageNotFound from "./Components/PageNotFound.jsx";
import Navbar from "./Components/Navbar.jsx";
import BalPage from "./Components/BalPage.jsx";
import Page from "./Components/Page.jsx";
import RegisterPage from "./Components/RegisterPage.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import Footer from "./Components/Footer.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bal" element={<BalPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

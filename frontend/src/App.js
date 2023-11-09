import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import PageNotFound from "./Components/PageNotFound.jsx";
import Navbar from "./Components/Navbar.jsx";
import Page from "./Components/Page.jsx";
import RegisterPage from "./Components/RegisterPage.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import Footer from "./Components/Footer.jsx";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            columnGap: "1em",
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/links">Links</Link>
        </div>
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/page" element={<Page />} />
        <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


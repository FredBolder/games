import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageNotFound from "./Components/PageNotFound.jsx";
import BalPage from "./Components/BalPage.jsx";
import TennisPage from "./Components/TennisPage.jsx";
import Page from "./Components/Page.jsx";
import RegisterPage from "./Components/RegisterPage.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import GlobalState from "./Context/GlobalState";

function App() {
  return (
    <div>
      <GlobalState>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Page />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/bal" element={<BalPage />} />
            <Route path="/tennis" element={<TennisPage />} />
            <Route path="/policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </GlobalState>
    </div>
  );
}

export default App;

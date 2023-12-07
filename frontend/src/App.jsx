import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageNotFound from "./Components/PageNotFound.jsx";
import BalPage from "./Components/BalPage.jsx";
import Page from "./Components/Page.jsx";
import RegisterPage from "./Components/RegisterPage.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import GlobalState from "./Context/GlobalState";
import Test from "./Components/Test.jsx"; 

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
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </GlobalState>
    </div>
  );
}

export default App;

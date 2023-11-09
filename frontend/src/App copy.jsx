import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Page from "./Components/LandingPage/Page";
import RegisterPage from "./Components/RegisterPage/RegisterPage";
import LoginPage from "./Components/LoginPage/LoginPage";
import Footer from "./Components/Footer/Footer";

function App() {
	return (
		/*<Router>
			<Navbar />
			<Switch>
				<Route path="/" exact component={Page} />
				<Route path="/register" component={RegisterPage} />
				<Route path="/login" component={LoginPage} />
			</Switch>
			<Footer />
		</Router>*/
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

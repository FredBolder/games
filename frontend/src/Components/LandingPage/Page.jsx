import React from "react";
import Navbar from "../Navbar/Navbar";
import "./Page.css";

function Page() {
	return (
		
		<div className="pageContainer">
			<Navbar />
				<div id="hero" className="hero">
					<div className="hero-content">
						<h1 className="hero-title">The Journey Begins Here</h1>
						<div className="btn-container">
						<button className="btn btn-primary">Login</button>
						<button className="btn btn-primary">Register</button>
						</div>
					</div>
				</div>
			
			
		</div>
	);
}

export default Page;

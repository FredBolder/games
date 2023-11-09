import React from "react";
import "./RegisterPage.css";

function RegisterPage() {
	return (
		<>
			<main className="loginBody">
				<div className="loginBox">
					<div className="loginBoxInfo">
						<div className="loginBoxInfos">
							<div className="registerHeader">
								<h3>Register Here:</h3>
							</div>
							<div className="registerForm">
								<form action="">
									<p className="form-label">First Name:</p>
									<input type="text" className="form-input" />
									<p className="form-label">UserName:</p>
									<input type="text" className="form-input" />
									<p className="form-label">Email:</p>
									<input type="email" className="form-input" />
									<p className="form-label">Password:</p>
									<input type="password" className="form-input" />
									<p className="form-label">Confirm Password:</p>
									<input type="password" className="form-input" />

									<button type="submit" className="register-button">
										Register
									</button>
								</form>
							</div>
						</div>

						<div className="alternate-LoginBox">
							<div className="social-register">
								<h3>Register also with your Google account:</h3>
								<p>Here will be Google window</p>
							</div>
						</div>
					</div>
				</div>
				
			</main>
		</>
	);
}

export default RegisterPage;

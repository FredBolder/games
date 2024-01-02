import React from "react";
import Navbar from "./Navbar";
import Footer from "../Components/Footer";

function AboutPage() {
  return (
    <div className="about">
      <main>
        <header>
          <Navbar />
        </header>
        <h1 className="title">About us</h1>
        <div className="aboutBox">
          <h4>About the developers</h4>
          <h5>
            We are a team of motivated people from different career backgrounds,
            coming together to colaborate on a final project as a testament to
            what we have learned not only from DCI, but from each other and with
            that embarking on the journey of self-discovery, continuous
            learning and improvement that is programing.
          </h5>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default AboutPage;

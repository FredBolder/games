import React from "react";
import Navbar from "./Navbar";
import Footer from "../Components/Footer";
import { randomiseArray } from "../utils";

function AboutPage() {
  let names = [
    "Michał Kotkowicz",
    "Donnie Avant",
    "Fred Bolder",
    "Diana Sahlean",
  ];
  let randomNames = randomiseArray(names);
  return (
    <div className="about">
      <main>
        <header>
          <Navbar />
        </header>
        <h1 className="title">About us</h1>
        <div className="aboutBox">
          <h4>The developers</h4>
          <p>
            We (in random order: {randomNames[0]}, {randomNames[1]},{" "}
            {randomNames[2]} and {randomNames[3]}) are a team of motivated
            people from different career backgrounds, that came together to
            colaborate on this final project as a testament to what we have
            learned not only from DCI (Digital Career Institute GmbH), but also
            from each other and with that embarking on the journey of
            self-discovery, continuous learning and improvement that is
            programming.
          </p>
          <h4 className="topmargin">The games</h4>
          <p>
            Tennis (mainly programmed by Donnie) is inspired by the arcade video game Pong.
          </p>
          <p>  
            <br />
            Bal (dutch translation of ball) is the online version of the{" "}
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://fredbolder.github.io/bal/"
            >
              pc game Bal
            </a>{" "}
            by Fred Bolder, first programmed in Turbo Pascal for DOS and
            later in C# for Windows.
          </p>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default AboutPage;

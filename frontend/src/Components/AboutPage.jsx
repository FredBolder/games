import Navbar from "./Navbar";
import Footer from "../Components/Footer";
import { randomiseArray } from "../utils";

function AboutPage() {
  let indexes = [0, 1, 2, 3];
  let names = [
    "Michał Kotkowicz",
    "Donnie Avant",
    "Fred Bolder",
    "Diana Sahlean",
  ];
  let sites = [
    "https://github.com/michalkotkowicz",
    "https://github.com/Dnnavant",
    "https://fredbolder.github.io/portfolio/",
    "https://github.com/LazuliPhoenix",
  ];
  let randomIndexes = randomiseArray(indexes);

  return (
    <div className="page">
      <header>
        <Navbar />
      </header>
      <main>
        <h1 className="title">About us</h1>
        <div className="boxWithScroll">
          <h4>The developers</h4>
          <p>
            We (in random order:{" "}
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href={sites[randomIndexes[0]]}
            >
              {names[randomIndexes[0]]}
            </a>
            ,{" "}
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href={sites[randomIndexes[1]]}
            >
              {names[randomIndexes[1]]}
            </a>
            ,{" "}
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href={sites[randomIndexes[2]]}
            >
              {names[randomIndexes[2]]}
            </a>{" "}
            and{" "}
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href={sites[randomIndexes[3]]}
            >
              {names[randomIndexes[3]]}
            </a>
            {") "}
            are a team of motivated people from different career backgrounds,
            that came together to colaborate on this final project as a
            testament to what we have learned not only from DCI (Digital Career
            Institute GmbH), but also from each other and with that embarking on
            the journey of self-discovery, continuous learning and improvement
            that is programming.
          </p>
          <p>
            As of Jan. 17, 2024, Fred Bolder is working on this site. The
            styling of the whole site is improved. The game Tennis is now also
            playable on a phone or a tablet. There are a lot of new levels added
            to the game Bal. New in the game Bal are swimming, red fish,
            electricity, trap doors and a button to skip a level, in case it is
            too difficult.<br />
            Fred Bolder has created a new site for the game Bal with more than 280 levels
            and many new objects!<br />
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://bal-online.onrender.com/"
            >
              pc game Bal
            </a><br />         
          </p>
          <h4 className="topmargin">The games</h4>
          <p>
            Tennis (mainly programmed by Donnie) is inspired by the arcade video
            game Pong.
          </p>
          <p>
            <br />
            Bal was first programmed by Fred Bolder in Turbo Pascal for DOS and later
            in C# for Windows. For this site Bal was rewritten for JavaScript and now Bal has improved a lot add
            has its own site.
          </p>
          <h4 className="topmargin">Contact</h4>
          <p>
            You can contact us by email{" "}
            <a className="link" href="mailto:fgh.bolder@gmail.com">
              fgh.bolder@gmail.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;

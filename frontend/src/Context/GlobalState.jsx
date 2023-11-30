import { useState } from "react";
import InfoContext from "./InfoContext";

function GlobalState(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <InfoContext.Provider value={{ loggedIn, setLoggedIn }}>
      {props.children}
    </InfoContext.Provider>
  );
}
export default GlobalState;

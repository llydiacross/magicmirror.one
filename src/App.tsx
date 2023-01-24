import React, { useEffect, useState } from "react";
import FixedElements from "./components/FixedElements";
import Header from "./components/Header";
import WebEvents from "./webEvents";

const App = (): JSX.Element => {
  const [currentDestination, setCurrentDestination] = useState<string>("");

  useEffect(() => {
    WebEvents.on("gotoDestination", (destination: string) => {
      setCurrentDestination(destination);
    });
  });

  return (
    <>
      <Header forceTypeWriter={currentDestination} />
      {/** Contains the footer and the 0x0zLogo with the console button */}
      <FixedElements />
    </>
  );
};

export default App;

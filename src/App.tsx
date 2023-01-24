import React from "react";
import FixedElements from "./components/FixedElements";
import Header from "./components/Header";

const App = (): JSX.Element => {
  return (
    <>
      <Header />
      {/** Contains the footer and the 0x0zLogo with the console button */}
      <FixedElements />
    </>
  );
};

export default App;

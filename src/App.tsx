import React from "react";
import AppContextProvider from "./contexts/appContext";
import IDE from "./pages/IDE";
import Index from "./pages/Index";

const App = (): JSX.Element => {
  return (
    <AppContextProvider>
      <IDE />
    </AppContextProvider>
  );
};

export default App;

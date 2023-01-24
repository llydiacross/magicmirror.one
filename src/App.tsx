import React from "react";
import AppContextProvider from "./contexts/appContext";
import Index from "./pages/Index";

const App = (): JSX.Element => {
  return (
    <AppContextProvider>
      <Index />
    </AppContextProvider>
  );
};

export default App;

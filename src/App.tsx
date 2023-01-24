import React, { useState } from "react";
import FixedElements from "./components/FixedElements";
import Header from "./components/Header";
import SettingsModal from "./modals/SettingsModal";

const App = (): JSX.Element => {
  const [shouldShowSettings, setShouldShowSettings] = useState(false);
  return (
    <>
      <Header />
      {/** Contains the footer and the 0x0zLogo with the console button */}
      <FixedElements
        onSettings={() => {
          setShouldShowSettings(!shouldShowSettings);
        }}
      />
      <SettingsModal
        hidden={!shouldShowSettings}
        onHide={() => {
          setShouldShowSettings(false);
        }}
      />
    </>
  );
};

export default App;

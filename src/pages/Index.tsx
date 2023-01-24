import React, { useState } from "react";
import Header from "../components/Header";
import FixedElements from "../components/FixedElements";
import SettingsModal from "../modals/SettingsModal";

export default function Index() {
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
}

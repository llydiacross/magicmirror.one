import React, { useState } from "react";
import PropTypes from "prop-types";
import FixedElements from "../components/FixedElements";
import SettingsModal from "../modals/SettingsModal";
function Viewer(props) {
  const [shouldShowSettings, setShouldShowSettings] = useState(false);
  return (
    <div>
      <FixedElements />
      <SettingsModal
        hidden={!shouldShowSettings}
        onHide={() => {
          setShouldShowSettings(false);
        }}
      />
    </div>
  );
}

Viewer.propTypes = {};

export default Viewer;

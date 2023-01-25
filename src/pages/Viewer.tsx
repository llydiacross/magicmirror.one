import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import FixedElements from "../components/FixedElements";
import SettingsModal from "../modals/SettingsModal";
import { Web3Context } from "../contexts/web3Context";
import { ENSContext } from "../contexts/ensContext";
function Viewer(props) {
  const [shouldShowSettings, setShouldShowSettings] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const context = useContext(Web3Context);
  const ensContext = useContext(ENSContext);

  useEffect(() => {
    if (!context.loaded) return;
    setError(null);

    if (ensContext.ensError) {
      setError(ensContext.ensError);
      return;
    }
  }, [context, ensContext]);

  return (
    <div>
      {error == null ? (
        <></>
      ) : (
        <>
          <div className="hero min-h-screen">
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content bg-error">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold text-black">
                  Malfuction
                </h1>
                <p className="mb-5 text-black">
                  We encountered an error while trying to find this eth domain.
                  This usually means the eth domain is non existent or does not
                  have a registry controller yet. Double check that you have{" "}
                  <u>deployed your registry controller</u>. Then try refreshing
                  the page.
                </p>
                <button
                  className="btn btn-dark w-full"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {loaded && error === null ? (
        <></>
      ) : (
        <>
          <div className="hero min-h-screen">
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold">
                  Loading <u>{ensContext.currentEnsAddress}</u>
                </h1>
                <p className="mb-5">
                  Please wait while we adjust some things for you...
                </p>
                <div
                  style={{ "--value": percentage } as any}
                  className="radial-progress bg-primary text-primary-content border-4 border-primary"
                >
                  {percentage + "%"}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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

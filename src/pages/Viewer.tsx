import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import FixedElements from "../components/FixedElements";
import SettingsModal from "../modals/SettingsModal";
import { Web3Context } from "../contexts/web3Context";
import { ENSContext } from "../contexts/ensContext";
import { withRouter, useHistory } from "react-router-dom";
import { Web3File, Web3Response } from "web3.storage";
import HTMLRenderer from "../components/HTMLRenderer";
import { getIPFSProvider } from "../helpers";

function Viewer({ match }) {
  const [shouldShowSettings, setShouldShowSettings] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [dir, setDir] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [currentEnsDomain, setCurrentEnsDomain] = useState(
    match?.params?.token
  );
  const ensContext = useContext(ENSContext);
  const history = useHistory();

  useEffect(() => {
    setError(null);

    if (ensContext.loaded) ensContext.setCurrentEnsAddress(currentEnsDomain);
    if (!ensContext.loaded && !ensContext.valid) return;

    if (ensContext.ensError !== null) {
      setError(ensContext.ensError);
      setLoaded(true);
      return;
    }

    setPercentage(0);

    let main = async () => {
      let ipfs = getIPFSProvider("web3-storage", true);

      setPercentage(50);
      if (ensContext.contentHash !== null) {
        setEmpty(false);

        try {
          let dir = (await ipfs.getDirectory(
            ensContext.contentHash
          )) as Web3Response;
          let files = await dir.files();
          setDir(files);
          let html = await files
            .filter((file) => file.name === "index.html")[0]
            .stream()
            .getReader()
            .read();

          let decode = new TextDecoder().decode(html.value);
          setBuffer(decode);
        } catch (error) {
          console.error(error);
          setDir([]);
        }
      } else {
        setEmpty(true);
      }

      setLoaded(true);
      setPercentage(100);
    };

    main().catch((error) => {
      console.error(error);
      setError(error);
    });
  }, [ensContext, currentEnsDomain]);

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
                  have a registry controller yet or it could be an IPFS cache
                  issue. Double check that you have{" "}
                  <u>deployed your registry controller</u>. Then try refreshing
                  the page.
                </p>
                <button
                  className="btn btn-dark w-full"
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  Home
                </button>
                <button
                  className="btn btn-dark w-full mt-2"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {loaded && error === null ? (
        <>
          {empty ? (
            <div className="hero min-h-screen">
              <div className="hero-overlay bg-opacity-60"></div>
              <div className="hero-content text-center text-neutral-content bg-error">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold text-black">Empty</h1>
                  <p className="mb-5 text-black">
                    This ENS address is valid but doesn't have a content hash
                    set. You should let the owner know they can come to this
                    site and create an awesome page for it!
                  </p>
                  <button
                    className="btn btn-dark w-full"
                    onClick={() => {
                      history.push("/");
                    }}
                  >
                    Home
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <HTMLRenderer
                implicit={buffer}
                currentFile={"index.html"}
                style={{ width: "100%", height: "100%", position: "absolute" }}
              />
            </>
          )}
        </>
      ) : (
        <>
          <div className="hero min-h-screen">
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold m-w-50 truncate">
                  Loading <u>{ensContext.currentEnsAddress}</u>
                </h1>
                <p className="mb-5">
                  Please wait while we adjust some things for you...
                </p>
                <div
                  style={{ "--value": percentage } as any}
                  className="radial-progress bg-warning text-primary-content border-4 border-warning"
                >
                  {percentage + "%"}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <FixedElements
        hideSettings={!loaded}
        onSettings={() => {
          if (!loaded) return;
          setShouldShowSettings(!shouldShowSettings);
        }}
      />
      <SettingsModal
        hidden={!shouldShowSettings}
        onHide={() => {
          setShouldShowSettings(false);
        }}
      />
    </div>
  );
}

Viewer.propTypes = {
  match: PropTypes.object,
};

export default withRouter(Viewer);

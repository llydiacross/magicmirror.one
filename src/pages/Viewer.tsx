import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import FixedElements from "../components/FixedElements";
import SettingsModal from "../modals/SettingsModal";
import { ENSContext } from "../contexts/ensContext";
import { withRouter, useHistory } from "react-router-dom";
import { Web3Response } from "web3.storage";
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
  const ensContext = useContext(ENSContext);
  const abortRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    if (ensContext.currentEnsAddress !== match.params.token) {
      ensContext.setCurrentEnsAddress(match.params.token);
      return;
    }

    if (!ensContext.loaded) return;
    if (loaded || ensContext.currentEnsAddress !== match.params.token) return;

    if (
      ensContext.contentHash === null &&
      ensContext.loaded &&
      ensContext.valid
    ) {
      setEmpty(true);
      setBuffer(null);
      setLoaded(true);
      return;
    }

    let main = async () => {
      try {
        let ipfs = getIPFSProvider("web3-storage", true);

        setPercentage(0);
        setLoaded(false);
        setBuffer(null);

        if (
          ensContext.contentHash !== null &&
          ensContext.currentEnsAddress === match.params.token
        ) {
          setError(null);
          setEmpty(false);

          console.log("fetching directory");
          if (abortRef.current !== null) abortRef.current.abort();
          abortRef.current = new AbortController();
          let response: Web3Response;
          try {
            response = (await ipfs.getDirectory(
              ensContext.contentHash,
              abortRef.current
            )) as Web3Response;
          } catch (error) {
            //ignore abort errors
            if (error.name === "AbortError") return;
            setError(error);
            setLoaded(true);
            return;
          }

          abortRef.current = null;
          let files = await response.files();
          setDir(files);
          let potentialHTML = await files.filter(
            (file) => file.name === "index.html"
          )[0];

          setPercentage(50);

          if (potentialHTML === undefined) {
            setEmpty(true);
          } else {
            let html = await potentialHTML.stream().getReader().read();
            let decode = new TextDecoder().decode(html.value);
            setBuffer(decode);
            setEmpty(false);
          }
        } else {
          setEmpty(true);
        }
        setPercentage(50);
        setPercentage(75);
      } catch (error) {
        setError(error);
        setBuffer(null);
        console.error(error);
      }

      setLoaded(true);
    };

    if (ensContext.currentEnsAddress === match.params.token) main();
  }, [match.params.token, ensContext, loaded]);

  useEffect(() => {
    return () => {
      if (abortRef.current !== null) abortRef.current.abort();
    };
  }, []);
  return (
    <div>
      <div className="hero min-h-screen" hidden={loaded}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-warning">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">
              Loading{" "}
              <span className="truncate underline">
                {ensContext.currentEnsAddress}
              </span>
            </h1>
            <p className="mb-5 text-black">
              This may take a few seconds, please be patient.
            </p>
            <div
              className="radial-progress bg-warning text-warning-content"
              style={{ "--value": percentage } as any}
            >
              {percentage + "%"}
            </div>
          </div>
        </div>
      </div>
      <div
        className="hero min-h-screen"
        hidden={
          !loaded || empty || ensContext.ensError !== null || error !== null
        }
      >
        {buffer !== null && ensContext.ensError === null ? (
          <HTMLRenderer implicit={buffer} currentFile="index.html" />
        ) : (
          <div className="hero min-h-screen">
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content bg-error">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold text-black">
                  Bad Buffer
                </h1>
                <p className="mb-5 text-black">
                  It appears that the buffer is not a valid HTML file.
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
        )}
      </div>
      <div className="hero-overlay bg-opacity-60"></div>
      {/** Empty Box */}
      <div
        className="hero min-h-screen"
        hidden={
          !loaded || !empty || error !== null || ensContext.ensError !== null
        }
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-error">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">Empty</h1>
            <p className="mb-5 text-black">
              It appears that this ENS address does not have any content on it.
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
      {/** ENS Error Box */}
      <div
        className="hero min-h-screen"
        hidden={!loaded || ensContext.ensError === null}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-error">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">
              404 Not Found
            </h1>
            <p className="mb-5 text-black">
              This ENS address does not exist and is can be purchased right now!
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
              Purchase
            </button>
          </div>
        </div>
      </div>
      {/** Error Box */}
      <div className="hero min-h-screen" hidden={error === null || empty}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-error">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">Malfuction</h1>
            <p className="mb-5 text-black underline truncate">
              {error !== null ? error.message : null}
            </p>
            <p className="mb-5 text-black">
              This is likely due to an issue with the ENS address or the
              content. If you believe this is an error, please contact us.
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

import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import FixedElements from "../components/FixedElements";
import SettingsModal from "../modals/SettingsModal";
import { ENSContext } from "../contexts/ensContext";
import { withRouter, useHistory } from "react-router-dom";
import { Web3File } from "web3.storage";
import HTMLRenderer from "../components/HTMLRenderer";
import { getIPFSProvider } from "../helpers";
import { Web3StorageProvider } from "../ipfs";
import HeartIcon from "../components/Icons/HeartIcon";

const parseCDI = async (files: Web3File[], setPercentage: Function) => {
  let partialFiles = files.filter(
    (file) => file.name.indexOf(".partial") !== -1
  );
  let indexFiles = files.filter((file) => file.name === "index.html");

  let html;
  if (indexFiles.length === 0 && partialFiles.length === 0) {
    //no index.html found
    return {
      valid: false,
    };
  } else if (partialFiles.length > 0) {
    //found partial files
    let partialHtml = partialFiles.filter(
      (file) => file.name === "index.partial"
    )[0];
    let partialCss = partialFiles.filter(
      (file) => file.name === "css.partial"
    )[0];
    let partialJS = partialFiles.filter(
      (file) => file.name === "js.partial"
    )[0];
    let partialXens = partialFiles.filter((file) => file.name === ".xens")[0];

    let struct = {};
    if (partialHtml !== undefined)
      struct["html"] = new TextDecoder().decode(
        (await partialHtml.stream().getReader().read()).value
      );

    if (partialCss !== undefined)
      struct["css"] = new TextDecoder().decode(
        (await partialCss.stream().getReader().read()).value
      );
    if (partialJS !== undefined)
      struct["js"] = new TextDecoder().decode(
        (await partialJS.stream().getReader().read()).value
      );

    if (partialXens !== undefined)
      struct[".xens"] = new TextDecoder().decode(
        (await partialXens.stream().getReader().read()).value
      );

    return {
      valid: true,
      direct: false,
      source: struct,
    };
  } else if (indexFiles.length > 0) {
    //just use the index.html and draw render it to an iframe
    let potentialHTML = indexFiles[0];
    setPercentage(65);
    html = await potentialHTML.stream().getReader().read();
    html = new TextDecoder().decode(html.value);
    return {
      valid: true,
      direct: true,
      source: html,
    };
  }

  return {
    valid: false,
  };
};

const prepareDefaultContent = async (setPercentage: Function) => {
  //get the default content
  let defaultContent = await fetch("/audio.html");
  let html = await defaultContent.text();
  setPercentage(100);
  return html;
};

function Viewer({ match }) {
  const ensContext = useContext(ENSContext);
  const history = useHistory();

  const [shouldShowSettings, setShouldShowSettings] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [defaultResponse, setDefaultResponse] = useState(false);
  const [direct, setDirect] = useState(false);
  const [dir, setDir] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [aborted, setAborted] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const abortRef = useRef(null);
  const matchRef = useRef(null);
  const ipfsProvider = useRef<Web3StorageProvider>(null);
  const defaultResponseElement = useRef(null);

  if (ipfsProvider.current === null)
    ipfsProvider.current = getIPFSProvider(
      "web3-storage"
    ) as Web3StorageProvider;

  useEffect(() => {
    matchRef.current = match.params.token;
    if (
      ensContext.setCurrentEnsAddress !== null &&
      ensContext.currentEnsAddress !== matchRef.current
    ) {
      ensContext.setCurrentEnsAddress(match.params.token);
    }
  }, [ensContext, match.params.token]);

  useEffect(() => {
    if (!ensContext.loaded) return;
    if (ensContext.currentEnsAddress === null) return;
    if (ensContext.currentEnsAddress !== matchRef.current) return;
    if (loaded) return;

    let main = async () => {
      try {
        let isEmpty = false;

        setPercentage(10);
        if (
          ensContext.contentHash === null ||
          ensContext.contentHash.trim().length === 0
        ) {
          isEmpty = true;
        } else {
          if (abortRef.current !== null) abortRef.current.abort();
          let abortController = new AbortController();
          abortRef.current = abortController;
          setPercentage(20);
          let directory;
          try {
            directory = await ipfsProvider.current.getDirectory(
              ensContext.contentHash,
              abortRef.current
            );
          } catch (error) {
            if (error.name === "AbortError") {
              setAborted(true);
              return;
            }
            throw error;
          }

          setPercentage(30);
          let files = await directory.files();

          setPercentage(50);
          if (files.length === 0) {
            isEmpty = true;
          } else {
            let parsed = await parseCDI(files, setPercentage);
            setDir(files);
            if (parsed.valid) {
              setDirect(parsed.direct);
              setBuffer(parsed.source);
            } else isEmpty = true;
          }
        }

        setPercentage(80);
        if (isEmpty) {
          let defaultContent = await prepareDefaultContent(setPercentage);
          setDefaultResponse(defaultContent !== null);
          setBuffer(defaultContent);
          isEmpty = defaultContent === null;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPercentage(90);
        setEmpty(isEmpty);
        setAborted(false);
        setLoaded(true);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoaded(true);
      }
    };
    if (ensContext.ensError !== null) {
      setLoaded(true);
      return;
    }
    //call async
    main();
  }, [ensContext, loaded]);

  useEffect(() => {}, []);
  return (
    <div>
      <div className="hero min-h-screen" hidden={loaded}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-warning">
          <div className="max-w-md">
            <h1 className="mb-2 text-5xl font-bold text-black truncate">
              Loading{" "}
            </h1>
            <h2 className="mb-3 text-3xl text-black truncate underline">
              {ensContext.currentEnsAddress}
            </h2>
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
          !loaded ||
          empty ||
          ensContext.ensError !== null ||
          error !== null ||
          aborted
        }
      >
        {buffer !== null && !aborted && ensContext.ensError === null ? (
          <>
            {defaultResponse ? (
              <HTMLRenderer
                code={buffer.source}
                currentFile={(ensContext.currentEnsAddress || "null") + ".web3"}
              />
            ) : (
              <> </>
            )}
            {direct && !defaultResponse ? (
              <iframe
                title={ensContext.currentEnsAddress}
                style={{ width: "100%", height: "100%" }}
                src={
                  "https://dweb.link/ipfs/" +
                  ensContext.contentHash
                    .replace("ipfs://", "")
                    .replace("ipns://", "")
                }
              ></iframe>
            ) : (
              <HTMLRenderer
                implicit={buffer}
                currentFile={(ensContext.currentEnsAddress || "null") + ".web3"}
              />
            )}
          </>
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
      {/** Completely Empty Box */}
      <div
        className="hero min-h-screen max-w-screen"
        hidden={
          !loaded ||
          !empty ||
          error !== null ||
          ensContext.ensError !== null ||
          defaultResponse
        }
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-error">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">
              Completely Empty
            </h1>
            <p className="mb-5 text-black">
              This ENS address appears to have content hash associated with it.
              We also couldn't find any files in the directory, we also couldn't
              pull enough data including twitter, email or reddit to assemble a
              basic template.
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
        hidden={!loaded || ensContext.ensError === null || error !== null}
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
      <div
        className="hero min-h-screen max-w-screen"
        hidden={error === null || empty}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-error max-w-screen">
          <div className="max-w-sm">
            <h1 className="mb-5 text-5xl font-bold text-black">Malfuction</h1>
            <p className="mb-5 text-black underline truncate hidden lg:block md:block">
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
        linkHref={"/"}
        children={
          <>
            {defaultResponse &&
            error === null &&
            loaded &&
            ensContext.ensError === null ? (
              <div
                className="alert alert-warning shadow-lg p-2 opacity-60 hover:opacity-100 cursor-pointer w-auto"
                ref={defaultResponseElement}
                onClick={() => {
                  defaultResponseElement.current.style.display = "none";
                }}
              >
                <div>
                  <HeartIcon />
                  <span>
                    <b>
                      This was <u>automatically</u> <u>generated</u> by web.eth
                    </b>
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
            {loaded && error === null && ensContext.ensError === null ? (
              <div className="alert alert-secondary shadow-lg p-2 opacity-70 hover:opacity-100 cursor-pointer w-auto">
                <div className="underline">
                  <span>
                    <b>Tip {ensContext.currentEnsAddress} 💰</b>
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        }
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

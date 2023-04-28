/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FixedElements from '../components/FixedElements';
import SettingsModal from '../modals/SettingsModal';
import { ENSContext } from '../contexts/ensContext';
import { withRouter, useHistory } from 'react-router-dom';
import HTMLRenderer from '../components/HTMLRenderer';
import { fetchPrompt } from '../gpt3';
import {
  getProvider,
  getStats,
  IPFSDirectory,
  IPFSFile,
  IPFSProvider,
  IPFSStats,
  resolveDirectory,
  resolvePotentialCID,
} from '../ipfs';
import HeartIcon from '../components/Icons/HeartIcon';
import storage from '../storage';
import config from '../config';

const parseDirectory = async (files: IPFSFile[]) => {
  const partialFiles = files.filter((file) => file.name.includes('.partial'));
  const indexFiles = files.filter((file) => file.name === 'index.html');

  let html: any;
  if (indexFiles.length === 0 && partialFiles.length === 0) {
    // No index.html found
    return {
      valid: false,
    };
  } else if (partialFiles.length > 0) {
    // Found partial files
    const partialHtml = partialFiles.filter(
      (file) => file.name === 'index.partial'
    )[0];
    const partialCss = partialFiles.filter(
      (file) => file.name === 'css.partial'
    )[0];
    const partialJS = partialFiles.filter(
      (file) => file.name === 'js.partial'
    )[0];
    const partialXens = partialFiles.filter(
      (file) => file.name.split('.').pop() === 'xens'
    )[0];

    const struct: any = {};
    if (partialHtml !== undefined) {
      struct.html = new TextDecoder().decode(
        (await partialHtml.content.getReader().read()).value
      );
    }

    if (partialCss !== undefined) {
      struct.css = new TextDecoder().decode(
        (await partialCss.content.getReader().read()).value
      );
    }
    if (partialJS !== undefined) {
      struct.js = new TextDecoder().decode(
        (await partialJS.content.getReader().read()).value
      );
    }

    if (partialXens !== undefined) {
      struct['.xens'] = new TextDecoder().decode(
        (await partialXens.content.getReader().read()).value
      );
    }

    return {
      valid: true,
      direct: false,
      source: struct,
    };
  } else if (indexFiles.length > 0) {
    // Just use the index.html and draw render it to an iframe
    const potentialHTML = indexFiles[0];
    html = await potentialHTML.content.getReader().read();
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

const prepareDefaultContent = async (
  stats?: IPFSStats,
  ensAddress?: string
) => {
  if (!stats) {
    //no stats available, so we ask chat GPT 3
    const defaultContent = await fetch(
      ensAddress === 'aphextwin.eth' ? '/aphex.html' : '/default.html'
    );
    const html = await defaultContent.text();
    return html;
  }

  if (stats.hasMusic) {
    // Get the default content
    const defaultContent = await fetch('/audio.html');
    const html = await defaultContent.text();
    return html;
  }

  if (stats.hasVideos) {
    // Get the default content
    const defaultContent = await fetch('/video.html');
    const html = await defaultContent.text();
    return html;
  }

  if (stats.hasImages) {
    // Get the default content
    const defaultContent = await fetch('/image.html');
    const html = await defaultContent.text();
    return html;
  }

  //no stats available, so we ask chat GPT 3
  const defaultContent = await fetch('/default.html');
  const html = await defaultContent.text();
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
  const [stats, setStats] = useState<IPFSStats>(null);
  const [dir, setDir] = useState<IPFSDirectory>(null);
  const [buffer, setBuffer] = useState(null);
  const [aborted, setAborted] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const abortRef = useRef(null);
  const matchRef = useRef(null);
  const ipfsProvider = useRef<IPFSProvider>(null);
  const defaultResponseElement = useRef(null);

  //set the current IPFS provider for this component to be either web3-storage if they are using that or IPFS HTTP provider
  if (ipfsProvider.current === null) {
    if (storage.getGlobalPreference('useCustomProvider')) {
      if (storage.getGlobalPreference('customProvider') === 'web3-storage')
        ipfsProvider.current = getProvider('web3-storage', {
          apiKey: storage.getGlobalPreference('web3StorageApiKey'),
        });
      else
        ipfsProvider.current = getProvider('ipfs-http', {
          url:
            storage.getGlobalPreference('customProviderUrl') ||
            config.ipfsProviderURL,
        });
    }
  }
  // If the current ens address is not the same as the one in the url, update it
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

    const main = async () => {
      try {
        let isEmpty = false;
        let potentialStats: IPFSStats;

        //if there is no contentHash and it is completly empty then isEmpty is true
        if (
          ensContext.contentHash === null ||
          ensContext.contentHash.trim().length === 0
        ) {
          isEmpty = true;
        } else {
          //start the loading animation
          setPercentage(10);
          if (abortRef.current !== null) abortRef.current.abort();
          const abortController = new AbortController();
          abortRef.current = abortController;

          // Resolve the directory
          setPercentage(20);
          potentialStats = await getStats(
            ensContext.contentHash,
            abortController
          );
          setStats(potentialStats);

          let directory: IPFSDirectory;
          if (potentialStats && potentialStats?.fileCount !== 0) {
            try {
              directory = await resolveDirectory(
                ensContext.contentHash,
                abortController
              );
              setDir(directory);
              abortRef.current = null;
            } catch (error) {
              if (error.name === 'AbortError') {
                setAborted(true);
                return;
              }
              throw error;
            }
          }

          //once we have a directory, parse it and try and find the index.html or .partial files
          setPercentage(30);

          //try it
          try {
            if (
              potentialStats.fileCount === 0 ||
              directory.files.length === 0
            ) {
              isEmpty = true;
            } else {
              const parsed = await parseDirectory(directory.files);
              setPercentage(65);

              if (parsed.valid) {
                setDirect(parsed.direct);
                if (!parsed.direct) setBuffer(parsed.source);
                else
                  setBuffer(
                    config.ipfsWebProvider +
                      (await resolvePotentialCID(ensContext.contentHash))
                  );
              } else isEmpty = true;
            }
          } catch (error) {
            if (error.name === 'AbortError') return;

            console.error(error);

            //if it's a block with \cid error, then we can still render it if we use a direct link
            //TODO: Find a better way to do this
            if (error.message.indexOf('block with cid') !== -1) {
              setDirect(true);
              setBuffer(
                config.ipfsWebProvider +
                  (await resolvePotentialCID(ensContext.contentHash))
              );
              isEmpty = false;
            }
          }
        }

        //if we are empty then we want the AI to take control and try and generate some content
        if (isEmpty) {
          setPercentage(90);
          const defaultContent = await prepareDefaultContent(
            potentialStats,
            ensContext.currentEnsAddress
          );
          setDefaultResponse(defaultContent !== null);
          setBuffer(defaultContent);
          isEmpty = defaultContent === null;
        }

        setPercentage(100);
        setEmpty(isEmpty);
        setAborted(false);
        setLoaded(true);
      } catch (error) {
        setError(error);
        setLoaded(true);
      }
    };

    //if there is an ENS error already
    if (ensContext.ensError !== null) {
      setLoaded(true);
      return;
    }
    // Call async
    main();
  }, [ensContext, loaded]);

  return (
    <div>
      <div className="hero min-h-screen" hidden={loaded}>
        <div className="hero-overlay bg-opacity-60" />
        <div className="hero-content text-center text-neutral-content bg-warning">
          <div className="max-w-md">
            <h1 className="mb-2 text-5xl font-bold text-black truncate">
              Loading{' '}
            </h1>
            <h2 className="mb-3 text-3xl text-black truncate underline">
              {ensContext.currentEnsAddress}
            </h2>
            <p className="mb-5 text-black">
              This may take a few seconds, please be patient.
            </p>
            <div
              className="radial-progress bg-warning text-warning-content"
              style={{ '--value': percentage } as any}
            >
              {percentage + '%'}
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
            {!direct && !defaultResponse ? (
              <HTMLRenderer
                ensContext={{
                  ...ensContext,
                  setCurrentENSAddress: null,
                  resolver: null,
                  dir: dir,
                  stats: stats,
                }}
                code={buffer.source}
              />
            ) : (
              <> </>
            )}
            {direct && !defaultResponse ? (
              <iframe
                title={ensContext.currentEnsAddress}
                style={{ width: '100%', height: '100%' }}
                src={buffer}
              />
            ) : (
              <HTMLRenderer
                ensContext={{
                  ...ensContext,
                  setCurrentENSAddress: null,
                  resolver: null,
                  dir: dir,
                  stats: stats,
                }}
                implicit={buffer}
              />
            )}
          </>
        ) : (
          <div className="hero min-h-screen">
            <div className="hero-overlay bg-opacity-60" />
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
                    history.push('/');
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
      <div className="hero-overlay bg-opacity-60" />
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
        <div className="hero-overlay bg-opacity-60" />
        <div className="hero-content text-center text-neutral-content bg-error">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">
              Completely Empty
            </h1>
            <p className="mb-5 text-black">
              This ENS address appears to have content hash associated with it.
              We also couldn&apos;t find any files in the directory, we also
              couldn&apos;t pull enough data including twitter, email or reddit
              to assemble a basic template.
            </p>
            <button
              className="btn btn-dark w-full"
              onClick={() => {
                history.push('/');
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
        <div className="hero-overlay bg-opacity-60" />
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
                history.push('/');
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
            <button
              className="btn btn-dark w-full my-2"
              onClick={() =>
                fetchPrompt(ensContext.currentEnsAddress, abortRef.current)
              }
            >
              Or, why not see what it could look like?
            </button>
          </div>
        </div>
      </div>
      {/** Error Box */}
      <div
        className="hero min-h-screen max-w-screen"
        hidden={error === null || empty}
      >
        <div className="hero-overlay bg-opacity-60" />
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
                history.push('/');
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
        linkHref="/"
        hideSettings={!loaded}
        onSettings={() => {
          if (!loaded) return;
          setShouldShowSettings(!shouldShowSettings);
        }}
      >
        {
          <>
            {defaultResponse &&
            error === null &&
            loaded &&
            ensContext.ensError === null ? (
              <div
                className="alert alert-warning shadow-lg p-2 opacity-60 hover:opacity-100 cursor-pointer w-auto"
                ref={defaultResponseElement}
                onClick={() => {
                  defaultResponseElement.current.style.display = 'none';
                }}
              >
                <div>
                  <HeartIcon />
                  <span>
                    <b>
                      This was <u>automatically</u> <u>generated</u> by
                      MagicMirror
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
      </FixedElements>
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

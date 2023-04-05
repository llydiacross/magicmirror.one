import React, { useRef, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-dark.css';

import FixedElements from '../components/FixedElements';
import HTMLRenderer from '../components/HTMLRenderer';
import storage from '../storage';
import WebEvents from '../webEvents';
import SettingsModal from '../modals/SettingsModal';
import { useHistory } from 'react-router-dom';
import PublishModal from '../modals/PublishModal';
import ChatGPTModal from '../modals/ChatGPTModal';
import { ENSContext } from '../contexts/ensContext';
import { IPFSDirectory, IPFSStats, getStats, resolveDirectory } from '../ipfs';

const defaultTabs = {
  html: {
    name: '📃',
    icon: 'code',
    language: 'html',
    code: '',
  },
  css: {
    name: '🖌️',
    icon: 'code',
    language: 'css',
    code: '',
  },
  js: {
    name: '🧩',
    icon: 'code',
    language: 'javascript',
    code: '',
  },
  '.xens': {
    name: '📜',
    icon: 'code',
    language: 'json',
    code: '',
  },
};

function IDE({ theme }) {
  const [selectedTab, setSelectedTab] = useState('html');
  // eslint-disable-next-line no-unused-vars
  const [tabs, setTabs] = useState(defaultTabs);
  const [currentCode, setCode] = useState(
    storage.getPagePreference(selectedTab) || tabs[selectedTab].code
  );
  const [showPreview, setShowPreview] = useState(true);
  const [showCode, setShowCode] = useState(true);
  const [codeBuffer, setCodeBuffer] = useState(currentCode);
  const [overlayPreview, setOverlayPreview] = React.useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme || null);
  const [shouldShowSettings, setShouldShowSettings] = useState(false);
  const [shouldShowPublish, setShouldShowPublish] = useState(false);
  const [shouldShowChatGPT, setShouldShowChatGPT] = useState(false);
  const [dir, setDir] = useState<IPFSDirectory>(null);
  const [stats, setStats] = useState<IPFSStats>(null);
  const cooldown = useRef(null);
  const savedCode = useRef({} as any);
  const eventEmitterCallbackRef = useRef(null);
  const themeRef = useRef(theme || null);
  const history = useHistory();
  const ensContext = useContext(ENSContext);

  useEffect(() => {
    setTabs({
      ...tabs,
      html: {
        ...tabs.html,
        code: storage.getPagePreference('html') || '',
      },
      css: {
        ...tabs.css,
        code: storage.getPagePreference('css') || '',
      },
      js: {
        ...tabs.js,
        code: storage.getPagePreference('js') || '',
      },
      '.xens': {
        ...tabs['.xens'],
        code: storage.getPagePreference('.xens') || '',
      },
    });

    if (
      themeRef.current === null &&
      storage.getGlobalPreference('defaultTheme')
    ) {
      setCurrentTheme(storage.getGlobalPreference('defaultTheme'));
    }

    if (eventEmitterCallbackRef.current === null) {
      eventEmitterCallbackRef.current = () => {
        if (
          themeRef.current === null &&
          storage.getGlobalPreference('defaultTheme')
        ) {
          setCurrentTheme(storage.getGlobalPreference('defaultTheme'));
        }
      };
    }

    WebEvents.off('reload', eventEmitterCallbackRef.current);
    WebEvents.on('reload', eventEmitterCallbackRef.current);

    return () => {
      WebEvents.off('reload', eventEmitterCallbackRef.current);
    };
  }, []);

  useEffect(() => {
    //check get params if url exists
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const urlParam = urlParams.get('url');

    if (!urlParam) return;

    if (ensContext.currentEnsAddress !== urlParam)
      ensContext.setCurrentEnsAddress(urlParam);

    if (!ensContext.loaded) return;

    if (ensContext.contentHash !== null) {
      (async () => {
        let potentialStats = await getStats(ensContext.contentHash);
        setStats(potentialStats);
        let potentialDir = await resolveDirectory(ensContext.contentHash);
        setDir(potentialDir);
      })();
    } else {
      setStats({} as any);
      setDir({} as any);
    }
  }, [ensContext]);

  savedCode.current.css = storage.getPagePreference('css') || '';
  savedCode.current.js = storage.getPagePreference('js') || '';
  savedCode.current[selectedTab] =
    storage.getPagePreference(selectedTab) || currentCode;

  return (
    <div data-theme={currentTheme}>
      <div className="flex flex-col lg:flex-row w-full overflow-hidden">
        <div
          className="w-50 lg:w-full md:w-full overflow-y-scroll min-h-screen max-h-screen"
          hidden={!showCode || (overlayPreview && !showPreview)}
        >
          <div
            className="inline-flex w-full rounded-sm border-1 shadow-sm overflow-hidden z-50"
            role="group"
          >
            {Object.keys(tabs).map((tabIndex, index) => {
              const tab = tabs[tabIndex];
              return (
                <button
                  key={index}
                  data-selected={selectedTab === tabIndex}
                  className="btn rounded-none border-none text-white hover:text-white hover:bg-black"
                  onClick={() => {
                    clearTimeout(cooldown.current);
                    storage.saveData();
                    setSelectedTab(tabIndex);
                    setCode(
                      storage.getPagePreference(tabIndex) ||
                        savedCode.current[tabIndex] ||
                        tabs[tabIndex].code
                    );
                    setTabs({
                      ...tabs,
                      [tabIndex]: {
                        ...tab,
                        code: storage.getPagePreference(tabIndex) || tab.code,
                      },
                    });
                  }}
                >
                  {tab.name}
                </button>
              );
            })}
            <button
              className="btn rounded-none bg-success text-white hover:text-white hover:bg-black"
              onClick={() => {}}
            >
              ➕
            </button>
            <button className="btn rounded-none bg-pink-500 text-white hover:text-white hover:bg-black">
              📦
            </button>
            <button className="btn rounded-none bg-pink-500 text-white hover:text-white hover:bg-black">
              🗃️
            </button>
            <button
              className="btn rounded-none bg-warning animate-pulse text-white hover:text-white hover:bg-black"
              onClick={() => {
                setShouldShowPublish(!shouldShowPublish);
              }}
            >
              🌟
            </button>
            <button
              className="btn rounded-none bg-info animate-pulse text-white hover:text-white hover:bg-black"
              onClick={() => {
                setShouldShowChatGPT(!shouldShowPublish);
              }}
            >
              🤖
            </button>
          </div>
          <Editor
            value={currentCode}
            onValueChange={(code) => {
              if (code !== currentCode) setCode(code);
              // Wait for the user to stop typing
              clearTimeout(cooldown.current);
              cooldown.current = setTimeout(() => {
                storage.setPagePreference(selectedTab, code);
                storage.saveData();
                savedCode.current[selectedTab] = code;
                setCodeBuffer(code);
                setTabs({
                  ...tabs,
                  [selectedTab]: {
                    ...tabs[selectedTab],
                    code,
                  },
                });
              }, 800);
            }}
            highlight={(code) => {
              try {
                // Make a switch statement for the language
                switch (tabs[selectedTab].language) {
                  case 'html':
                    return highlight(code, languages.html);
                  case 'css':
                    return highlight(code, languages.css);
                  case 'js':
                    return highlight(code, languages.js);
                  case 'json':
                    return highlight(code, languages.json);
                }
              } catch (error) {}

              return highlight(code, languages.js);
            }}
            padding={24}
            className="z-50 line-numbers"
            spellCheck
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              background: 'rgba(0,0,0,0.1)',
              ...(!overlayPreview ? { border: '1px solid black' } : {}),
            }}
          />
        </div>
        <div
          className={'h-full ' + (showPreview ? 'w-full' : 'w-auto')}
          style={{
            borderLeft: '1px solid black',
            ...(overlayPreview
              ? {
                  position: 'absolute',
                  left: '0',
                  opacity: 0.4,
                  marginTop: 40,
                }
              : {}),
          }}
        >
          <div
            hidden={!showPreview}
            className="h-full w-full"
            style={{
              ...(overlayPreview
                ? {
                    pointerEvents: 'none',
                    touchEvents: 'none',
                    paddingTop: 20,
                    width: '90%',
                    marginLeft: '5%',
                    paddingLeft: 20,
                  }
                : {}),
            }}
          >
            {ensContext.loaded && ensContext.ensError !== null ? (
              <>
                <div className="bg-red-500 text-white p-2 rounded-md">
                  <p className="font-bold">ENS Error</p>
                  <p>{ensContext.ensError}</p>
                  <p
                    style={{
                      fontSize: 10,
                    }}
                  >
                    Preview might contain broken ENS information!
                  </p>
                </div>
              </>
            ) : (
              <></>
            )}
            <HTMLRenderer
              code={savedCode.current}
              stylesheets={[
                'https://cdn.jsdelivr.net/npm/daisyui@2.47.0/dist/full.css',
              ]}
              meta={[
                {
                  tag: 'title',
                  children: 'web3.eth',
                },
              ]}
              ensContext={{
                ...ensContext,
                setCurrentENSAddress: null,
                resolver: null,
                dir: dir,
                stats: stats,
              }}
              scripts={['https://cdn.tailwindcss.com']}
              currentFile={selectedTab}
              style={{
                ...(!overlayPreview
                  ? {
                      height: '93vh',
                      border: '1px solid black',
                    }
                  : {}),
              }}
            />
          </div>
          <div
            className={
              'w-full bg-gray-700 border-1 border-black p-2 ' +
              (showPreview
                ? 'flex flex-col lg:flex-row md:flex-row'
                : 'flex flex-col') +
              ' ' +
              (overlayPreview && showPreview ? 'h-40' : '')
            }
          >
            <button
              className="btn rounded-none bg-pink-500 border-none text-white hover:text-white hover:bg-black"
              onClick={() => setShowPreview(!showPreview)}
            >
              {!showPreview ? 'Show Preview' : 'Hide Preview'}
            </button>
            <button
              className="btn rounded-none bg-pink-500 border-none text-white hover:text-white hover:bg-black"
              onClick={() => setShowCode(!showCode)}
            >
              {!showCode ? 'Show Code' : 'Hide Code'}
            </button>
            <button
              className="btn rounded-none bg-pink-500 border-none text-white hover:text-white hover:bg-black"
              onClick={() => setOverlayPreview(!overlayPreview)}
            >
              {!overlayPreview ? 'Overlay Preview' : 'Stop Overlaying Preview'}
            </button>
            <button className="btn rounded-none bg-info border-none text-white hover:text-white hover:bg-black">
              💾
            </button>
            <button className="btn rounded-none bg-info border-none text-white hover:text-white hover:bg-black">
              📁
            </button>
            <button
              className="btn rounded-none bg-transparent border-none text-white hover:text-white hover:bg-black w-50"
              onClick={() => {
                setShouldShowSettings(!shouldShowSettings);
              }}
            >
              ⚙️
            </button>
            <button
              className="btn rounded-none bg-transparent border-none text-white hover:text-white hover:bg-black w-50"
              onClick={() => {
                history.push('/');
              }}
            >
              🏠
            </button>
          </div>
        </div>
      </div>
      <FixedElements hideAlerts={false} hideSettings hideFooter hideUserInfo />
      <ChatGPTModal
        onSetHTML={(code) => {
          setShouldShowChatGPT(false);
          if (selectedTab === 'html') {
            setCode(code);
            setCodeBuffer(code);
          }

          setTabs({
            ...tabs,
            html: {
              ...tabs.html,
              code,
            },
          });

          if (codeBuffer.current && codeBuffer.current.html) {
            codeBuffer.current.html = code;
          }

          storage.setPagePreference('html', code);
          storage.saveData();
        }}
        hidden={!shouldShowChatGPT}
        onHide={() => {
          setShouldShowChatGPT(false);
        }}
      />

      <SettingsModal
        hidden={!shouldShowSettings}
        onHide={() => {
          setShouldShowSettings(false);
        }}
      />
      <PublishModal
        tabs={tabs}
        hidden={!shouldShowPublish}
        onHide={() => {
          setShouldShowPublish(false);
        }}
      />
    </div>
  );
}

IDE.propTypes = {
  theme: PropTypes.string,
};

export default IDE;

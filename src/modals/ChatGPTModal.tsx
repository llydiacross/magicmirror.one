import React, { useRef, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import storage from "../storage";
import { Web3Context } from "../contexts/web3Context";
import WebEvents from "../webEvents";
import ChatGPTHeader from "../components/ChatGPTHeader";
import { useHistory } from "react-router-dom";
import HeartIcon from "../components/Icons/HeartIcon";
import ViewIcon from "../components/Icons/ViewIcon";
import Loading from "../components/Loading";

function ChatGPTModal({ hidden, onHide, savedData = {} }) {
  const context = useContext(Web3Context);
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("dracula");
  const eventEmitterCallbackRef = useRef(null);
  const inputElement = useRef(null);
  const [hasInput, setHasInput] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (storage.getGlobalPreference("default_theme"))
      setCurrentTheme(storage.getGlobalPreference("default_theme"));

    if (eventEmitterCallbackRef.current === null) {
      eventEmitterCallbackRef.current = () => {
        if (storage.getGlobalPreference("default_theme"))
          setCurrentTheme(storage.getGlobalPreference("default_theme"));
      };
    }

    WebEvents.off("reload", eventEmitterCallbackRef.current);
    WebEvents.on("reload", eventEmitterCallbackRef.current);

    return () => {
      WebEvents.off("reload", eventEmitterCallbackRef.current);
    };
  }, []);

  //disables scrolling while this modal is active
  useEffect(() => {
    if (!hidden) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [hidden]);

  return (
    <div
      data-theme={currentTheme}
      className="mx-auto sm:w-3/5 md:w-3/5 lg:w-4/5 fixed inset-0 flex items-center overflow-y-auto z-50 bg-transparent"
      hidden={hidden}
    >
      <div className="bg-white rounded-md w-full overflow-y-auto max-h-screen shadow shadow-lg border-2">
        <div className="flex flex-col w-full">
          <div className="bg-info p-2 text-black text-3xl">
            <b>🤖</b>
          </div>
          <div className="flex flex-col p-2 w-full mt-2">
            <p className="text-2xl mb-2 text-black">
              <b>GPT-3 Rating</b>
            </p>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <HeartIcon />
                </div>
                <div className="stat-title">Solution Rating</div>
                <div className="stat-value text-primary">0%</div>
                <div className="stat-desc">Unknown</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-primary">
                  <ViewIcon />
                </div>
                <div className="stat-title">Amount of Solutions</div>
                <div className="stat-value text-primary">0</div>
                <div className="stat-desc">0.6 Complexity</div>
              </div>
            </div>
            {!loading ? <ChatGPTHeader /> : <Loading />}
            <div className="flex flex-col mt-4">
              <div className="form-control">
                <div className="input-group">
                  <input
                    type="text"
                    data-loading={loading}
                    disabled={loading}
                    ref={inputElement}
                    maxLength={52}
                    onKeyDown={(e) => {}}
                    onInput={() => {
                      setHasInput(inputElement.current.value.length > 0);
                    }}
                    placeholder="Ask GPT-3 a question..."
                    className="input input-bordered w-full "
                  />
                  <button
                    data-loading={loading}
                    disabled={loading || !hasInput}
                    onClick={() => {
                      setLoading(true);
                    }}
                    className="btn bg-success text-black hover:text-white hover:bg-black hover:text-yellow-500"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto w-full mt-4"></div>
            <div className="btn-group w-full mt-2">
              <button className="btn btn-success" disabled>
                Use Solution
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  if (onHide) onHide();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ChatGPTModal.propTypes = {
  hidden: PropTypes.bool,
  onHide: PropTypes.func,
};

export default ChatGPTModal;

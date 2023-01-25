import React, { useRef, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import storage from "../storage";
import { Web3Context } from "../contexts/web3Context";
import WebEvents from "../webEvents";
import config from "../config";
import { useHistory } from "react-router-dom";
import HeartIcon from "../components/Icons/HeartIcon";
import ViewIcon from "../components/Icons/ViewIcon";

function PublishModal({ hidden, onHide, savedData = {} }) {
  const defaultThemeRef = useRef(null);
  const context = useContext(Web3Context);
  const [currentTheme, setCurrentTheme] = useState("luxury");
  const eventEmitterCallbackRef = useRef(null);
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
      <div className="bg-white rounded-md flex w-full overflow-y-auto max-h-screen shadow shadow-lg">
        <div className="flex flex-col w-full">
          <div className="bg-pink-400 p-2 text-black text-3xl">
            <b>🌟</b>
          </div>
          <div className="flex flex-col p-2 w-full mt-2">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <HeartIcon />
                </div>
                <div className="stat-title">Web3 Rating</div>
                <div className="stat-value text-primary">80%</div>
                <div className="stat-desc">Elite Tier</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-primary">
                  <ViewIcon />
                </div>
                <div className="stat-title">Paypload Size</div>
                <div className="stat-value text-primary">2.6mb</div>
                <div className="stat-desc">50% of limit</div>
              </div>
            </div>
            <div className="overflow-x-auto w-full mt-4">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Version</th>
                    <th>Size</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="text-center">
                      <label>✅</label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src="https://cdn.icon-icons.com/icons2/1488/PNG/512/5352-html5_102567.png"
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">HTML</div>
                          <div className="text-sm opacity-50">index.html</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      1.0.0
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        initial
                      </span>
                    </td>
                    <td>1.0mb</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center">
                      <label>✅</label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src="https://icons.iconarchive.com/icons/martz90/hex/512/css-3-icon.png"
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">CSS</div>
                          <div className="text-sm opacity-50">style.css</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      1.0.0
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        initial
                      </span>
                    </td>
                    <td>0.24mb</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center">
                      <label>✅</label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png"
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">JS</div>
                          <div className="text-sm opacity-50">scripts.js</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      1.0.0
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        initial
                      </span>
                    </td>
                    <td>0.40mb</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center">
                      <label>✅</label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Moebius_strip.svg/1139px-Moebius_strip.svg.png"
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">XENS</div>
                          <div className="text-sm opacity-50">.xens</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      1.0.0
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        initial
                      </span>
                    </td>
                    <td>0.05mb</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="btn-group w-full mt-2">
              <button className="btn">Publish</button>
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

PublishModal.propTypes = {
  hidden: PropTypes.bool,
  onHide: PropTypes.func,
};

export default PublishModal;

import React, { useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
import ErrorIcon from "./Icons/ErrorIcon";
import { Web3Context } from "../contexts/web3Context";
import SuccessIcon from "./Icons/SuccessIcon";
import { ENSContext } from "../contexts/ensContext";
import { useHistory } from "react-router-dom";
import HeartIcon from "./Icons/HeartIcon";
import storage from "../storage";

function FixedElements({
  onSettings,
  walletError,
  hideAlerts = false,
  hideSettings = false,
  hideFooter = false,
  hideUserInfo = false,
  hideOwnership = false,
  children = null,
  linkHref = null,
}) {
  const context = useContext(Web3Context);
  const ensContext = useContext(ENSContext);
  const errorRef = useRef(null);
  const ensErrorRef = useRef(null);
  const [showHud, setShowHud] = useState(true);
  const hudRef = useRef(null);
  const history = useHistory();

  if (hudRef.current !== null && document.body.clientWidth < 568) {
    if (storage.getGlobalPreference("hide_alerts"))
      hudRef.current.style.display = "none";
    else hudRef.current.style.display = "flex";
  }

  if (hudRef.current !== null)
    if (storage.getGlobalPreference("hide_alerts"))
      hudRef.current.style.display = "none";
    else hudRef.current.style.display = "flex";

  return (
    <>
      {/** Element for the Wallet Error */}
      <div
        className="fixed top-0 left-0 z-50 flex-col gap-2 md:flex-row lg:flex-row p-2 max-h-[5rem]"
        ref={hudRef}
      >
        <div
          className="alert alert-info shadow-lg p-2 opacity-70 hover:opacity-100 cursor-pointer w-auto"
          hidden={
            !ensContext.loaded ||
            ensContext.ensError !== null ||
            !context.loaded ||
            !context.walletConnected ||
            hideAlerts ||
            hideUserInfo ||
            hideOwnership ||
            ensContext.owner?.toLowerCase() !==
              context.accounts[0]?.toLowerCase()
          }
        >
          <div
            className="text-center"
            onClick={() => {
              history.push(`/ide?url=${ensContext.currentEnsAddress}`);
            }}
          >
            <span className="text-4xl">
              <b>✏️</b>
            </span>
          </div>
        </div>
        <div
          className="alert alert-error shadow-lg p-4 opacity-70 hover:opacity-100 cursor-pointer w-auto max-w-[500px]"
          onClick={() => {
            ensErrorRef.current.hidden = true;
          }}
          ref={ensErrorRef}
          hidden={
            ensContext.ensError === null ||
            hideAlerts ||
            hideUserInfo ||
            ensContext.currentEnsAddress === null
          }
        >
          <div className="truncate">
            <ErrorIcon />
            <span className="truncate">
              <b>
                {ensContext.ensError?.message ||
                  ensContext?.ensError?.toString()}
              </b>
            </span>
          </div>
        </div>
        {context.walletConnected ? (
          <div
            hidden={hideAlerts || hideUserInfo}
            className="alert alert-success shadow-lg p-2 cursor-pointer opacity-70 hover:opacity-100 w-auto"
            onClick={() => {
              history.push(
                `/view/${context.ensAddresses[0] || context.accounts[0]}`
              );
            }}
          >
            <div className="truncate">
              <span>
                <b>{context.ensAddresses[0] || context.accounts[0]}</b>
              </span>
            </div>
          </div>
        ) : (
          <></>
        )}
        {children}
      </div>

      {/** 0x0zLogo */}
      <div className="fixed top-0 right-0 z-50" hidden={hideSettings}>
        <div className="flex flex-row items-start gap-4">
          {context.walletError ? (
            <div
              ref={errorRef}
              hidden={hideAlerts}
              className="alert alert-error shadow-lg animate-bounce p-4 mb-2 mt-4 opacity-70 hover:opacity-100 cursor-pointer w-auto h-full"
              onClick={() => {
                errorRef.current.hidden = true;
              }}
            >
              <div>
                <ErrorIcon className="h-[20px]" />
                <span>
                  <b className="mr-2">No Web3 Session</b>
                  {context.walletError?.message ||
                    context.walletError?.toString() ||
                    "We don't know why!"}
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div>
            <img
              src={ensContext.avatar || "/img/0x0zLogo.jpg"}
              alt="InfinityMint Logo"
              className="w-24 cursor-pointer"
              onClick={() => {
                if (linkHref !== null) {
                  history.push(linkHref);
                  return;
                }

                ensContext.currentEnsAddress !== null
                  ? history.push("/view/" + ensContext.currentEnsAddress)
                  : history.push("/");
              }}
            />
            <div className="flex flex-col">
              <button
                className="btn btn-square rounded-none bg-black border-none text-white w-full hover:text-white hover:bg-pink-500"
                onClick={onSettings}
              >
                SETTINGS
              </button>
              <button
                className="btn btn-square rounded-none bg-black border-none text-white w-full hover:text-white hover:bg-pink-500"
                onClick={onSettings}
              >
                CONTROLS
              </button>
              <button
                className={
                  "btn btn-square rounded-none border-none text-white w-full hover:text-white hover:bg-pink-500 " +
                  (!showHud ? "bg-pink-500" : "bg-black")
                }
                onClick={() => {
                  if (
                    hudRef.current.style.display === "block" ||
                    hudRef.current.style.display === "none"
                  )
                    hudRef.current.style.display = "flex";
                  else hudRef.current.style.display = "none";

                  storage.setGlobalPreference(
                    "hide_alerts",
                    hudRef.current.style.display === "none"
                  );
                  storage.saveData();
                  setShowHud(!showHud);
                }}
              >
                {showHud ? "HIDE 🏷️" : "SHOW 🏷️"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/** Footer */}
      <div className="fixed bottom-0 w-full z-50" hidden={hideFooter}>
        <div className="flex flex-col">
          <div className="w-full bg-black text-white text-center p-4">
            {" "}
            Created by{" "}
            <a
              href="https://twitter.com/0x0zAgency/"
              className="text-yellow-100 underline"
            >
              0x0zAgency
            </a>
            . Come check out our{" "}
            <a
              href="https://github.com/0x0zAgency/"
              className="text-yellow-100 underline"
            >
              GitHub
            </a>
            . Themes provided by{" "}
            <a
              href="https://daisyui.com/"
              className="text-yellow-100 underline"
            >
              daisyui
            </a>
            . Made with <u className="text-error">love</u> by{" "}
            <a href="/view/llydia.eth" className="text-yellow-100 underline">
              llydia.eth
            </a>
            .
          </div>
        </div>
      </div>
    </>
  );
}

FixedElements.propTypes = {
  onSettings: PropTypes.func,
  walletError: PropTypes.object,
};
export default FixedElements;

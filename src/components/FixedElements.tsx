import React, { useContext, useRef } from "react";
import PropTypes from "prop-types";
import ErrorIcon from "./Icons/ErrorIcon";
import { Web3Context } from "../contexts/web3Context";
import SuccessIcon from "./Icons/SuccessIcon";
import { ENSContext } from "../contexts/ensContext";
import { useHistory } from "react-router-dom";

function FixedElements({
  onSettings,
  walletError,
  hideAlerts = false,
  hideSettings = false,
  hideFooter = false,
  hideUserInfo = false,
}) {
  const context = useContext(Web3Context);
  const ensContext = useContext(ENSContext);
  const errorRef = useRef(null);
  const history = useHistory();

  return (
    <>
      {/** Element for the Wallet Error */}
      <div className="fixed top-0 left-0 z-50">
        {context.walletError ? (
          <>
            <div
              ref={errorRef}
              hidden={hideAlerts}
              className="alert alert-error shadow-lg m-5 animate-bounce pr-0 mr-0"
              onClick={() => {
                errorRef.current.hidden = true;
              }}
            >
              <div>
                <ErrorIcon />
                <span>
                  <b className="mr-2">No Web3 Session</b>
                  {context.walletError?.message ||
                    context.walletError?.toString() ||
                    "We don't know why!"}
                </span>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="fixed top-0 left-0">
        {context.walletConnected ? (
          <div hidden={hideAlerts || hideUserInfo}>
            <div
              className="alert alert-success shadow-lg m-5 hidden md:block lg:block pr-0 mr-0 cursor-pointer underline"
              onClick={() => {
                history.push(
                  `/view/${context.ensAddresses[0] || context.accounts[0]}`
                );
              }}
            >
              <div>
                <SuccessIcon className="animate-bounce" />
                <span>
                  <b>{context.ensAddresses[0] || context.accounts[0]}</b>
                </span>
              </div>
            </div>
            <div className="alert alert-success shadow-lg m-5 block md:hidden lg:hidden pr-4 mr-4">
              <div>
                <SuccessIcon className="animate-bounce" />
                <span>
                  <b>Connected</b>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div
          className="alert alert-error shadow-lg m-5 block pr-0 mr-0"
          hidden={ensContext.ensError === null || hideAlerts || hideUserInfo}
        >
          <div>
            <ErrorIcon />
            <span>
              <b>{ensContext.ensError?.message}</b>
            </span>
          </div>
        </div>
      </div>

      {/** 0x0zLogo */}
      <div className="fixed top-0 right-0" hidden={hideSettings}>
        <div className="flex flex-col">
          <img
            src={"/img/0x0zLogo.jpg"}
            alt="InfinityMint Logo"
            className="w-20 cursor-pointer"
            onClick={() => {
              history.push("/");
            }}
          />
          <button
            className="btn btn-square rounded-none bg-transparent border-none text-white w-20 hover:text-white hover:bg-pink-500"
            onClick={onSettings}
          >
            SETTINGS
          </button>
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
            . Our lovely themes we can offer you were created by the lovely
            people at{" "}
            <a
              href="https://daisyui.com/"
              className="text-yellow-100 underline"
            >
              daisyui
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

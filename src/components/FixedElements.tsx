import React from "react";
import PropTypes from "prop-types";

function FixedElements({ onSettings }) {
  return (
    <>
      <div className="fixed top-0 right-0 ">
        <div className="flex flex-col">
          <img
            src={"/img/0x0zLogo.jpg"}
            alt="InfinityMint Logo"
            className="w-20"
          />
          <button
            className="btn btn-square rounded-none bg-transparent border-none text-white w-20 hover:text-white hover:bg-pink-500"
            onClick={onSettings}
          >
            SETTINGS
          </button>
        </div>
      </div>
      <div className="fixed bottom-0 w-full">
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
            .
          </div>
        </div>
      </div>
    </>
  );
}

FixedElements.propTypes = {
  onSettings: PropTypes.func,
};
export default FixedElements;

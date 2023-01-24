import React from "react";
import PropTypes from "prop-types";

function ConsoleModal({ hidden, onHide }) {
  return (
    <div
      className="mx-auto sm:w-3/4 md:w-2/4 fixed inset-0 flex items-center"
      hidden={hidden}
    >
      <div className="bg-white rounded-md flex w-full">
        <div className="flex flex-col w-full">
          <div className="bg-pink-500 p-2 text-white text-2xl">
            <b>⚙️ The Settings</b>
          </div>
          <div className="flex flex-col flex-1 p-3">
            <p className="mt-4">
              In order to edit your ens domains using web.eth you will need to
              have a valid IPFS endpoint or a Web3.Storage account.
            </p>

            <div className="form-control mt-4">
              <p className="text-2xl mb-4 border-b-2">Web3.Storage</p>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter Web3 Storage Key..."
                  className="input input-bordered w-full"
                />
                <button className="btn bg-black w-[12em] hover:text-white">
                  Sign Up To Web3 Storage
                </button>
              </div>
            </div>
            <div className="form-control mt-4">
              <p className="text-2xl mb-4 border-b-2">IPFS Companion</p>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter your IPFS Companion Endpoint..."
                  className="input input-bordered  w-full"
                />
                <button className="btn bg-black w-[12em] hover:text-white">
                  Check
                </button>
              </div>
            </div>
            <p className="mt-4">
              More information on what this means can{" "}
              <a href="?" className="underline text-yellow-500">
                be found here
              </a>
              .
            </p>
            <button
              className="btn bg-success text-black mt-4 hover:text-white"
              onClick={onHide}
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ConsoleModal.propTypes = {
  hidden: PropTypes.bool,
  onHide: PropTypes.func,
};

export default ConsoleModal;

import React, { useRef } from "react";
import PropTypes from "prop-types";
import storage from "../storage";

function ConsoleModal({ hidden, onHide }) {
  const web3StorageRef = useRef(null);
  const ipfsCompanionRef = useRef(null);

  return (
    <div
      className="mx-auto sm:w-3/4 md:w-2/4 fixed inset-0 flex items-center"
      hidden={hidden}
    >
      <div className="bg-white rounded-md flex w-full">
        <div className="flex flex-col w-full">
          <div className="bg-yellow-400 p-2 text-black text-3xl">
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
                  ref={web3StorageRef}
                  defaultValue={
                    storage.getGlobalPreference("web3_storage_key") || ""
                  }
                  placeholder="Enter Web3 Storage Key..."
                  className="input input-bordered w-full"
                />
                <button className="btn bg-black w-[12em] hover:text-white">
                  Sign Up To Web3 Storage
                </button>
              </div>
            </div>
            <div className="form-control mt-4">
              <p className="text-2xl mb-4 border-b-2">
                IPFS Companion / Endpoint
              </p>
              <div className="input-group">
                <input
                  type="url"
                  defaultValue={
                    storage.getGlobalPreference("ipfs_companion_endpoint") ||
                    "http://localhost:5001/api/v0"
                  }
                  ref={ipfsCompanionRef}
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
              className="btn bg-pink-500 text-white mt-4 hover:bg-success animate-pulse hover:animate-none"
              onClick={() => {
                storage.setGlobalPreference(
                  "web3_storage_key",
                  web3StorageRef.current.value
                );
                storage.setGlobalPreference(
                  "ipfs_companion_endpoint",
                  ipfsCompanionRef.current.value
                );
                storage.saveData();
                if (onHide) onHide();
              }}
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

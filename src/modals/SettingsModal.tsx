import React, { useRef, useContext } from "react";
import PropTypes from "prop-types";
import storage from "../storage";
import { AppContext } from "../contexts/appContext";

function ConsoleModal({ hidden, onHide }) {
  const web3StorageRef = useRef(null);
  const ipfsCompanionRef = useRef(null);
  const context = useContext(AppContext);

  return (
    <div
      className="mx-auto sm:w-3/5 md:w-3/4 lg:w-2/4 fixed inset-0 flex items-center  overflow-y-auto"
      hidden={hidden}
    >
      <div className="bg-white rounded-md flex w-full">
        <div className="flex flex-col w-full">
          <div className="bg-yellow-400 p-2 text-black text-3xl">
            <b>⚙️</b>
          </div>
          <div className="flex flex-col flex-1 p-3">
            <p className="mt-4">
              Here you can specify the storage provider you want to use. You
              must have an account with web3.storage or an IPFS Companion on
              your system.
            </p>

            <div className="form-control mt-4">
              <p className="text-2xl mb-4 border-b-2 text-black">
                Web3.Storage
              </p>
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
              <button className="btn btn-sm bg-blue-500 mt-2 text-black hover:text-white">
                Check Web3 Storage Key
              </button>
            </div>
            <div className="form-control mt-4">
              <p className="text-2xl mb-4 text-black border-b-2">
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
            {context.walletConnected ? (
              <>
                <p className="text-2xl mb-4 mt-2 text-black border-b-2">
                  Your Connected Accounts
                </p>
                <div className="overflow-x-auto">
                  <table className="table w-full mb-2">
                    <thead>
                      <tr>
                        <th></th>

                        <th>Wallet Address</th>
                        <th>ENS Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {context.accounts.map((account, index) => {
                        return (
                          <tr key={index}>
                            <th>{index}</th>
                            <td>{account}</td>
                            <td>Waiting...</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <button className="btn btn-sm w-full bg-red-500 mt-2 text-white hover:bg-black">
                  Disconnect
                </button>
              </>
            ) : (
              <></>
            )}
            <p className="mt-4">
              More information on what this means can{" "}
              <a href="?" className="underline text-yellow-500">
                be found here
              </a>
              .
            </p>
            <button
              className="btn bg-success text-white mt-4 hover:bg-black animate-pulse hover:animate-none"
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

import React, { useRef, useState, useContext } from "react";
import ErrorIcon from "./Icons/ErrorIcon";
import WebEvents from "../webEvents";
import { ENSContext } from "../contexts/ensContext";
import { useHistory } from "react-router-dom";
import config from "../config";

export default function DestinationFinder() {
  const inputElement = useRef(null);
  const ensContext = useContext(ENSContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasInput, setHasInput] = useState(false);
  const errorRef = useRef(null);
  const history = useHistory();
  let gotoAddress = async (destination: string) => {
    setError(false);
    destination = destination.toString();
    destination = destination.trim();
    //remove leading and trailing dots
    destination = destination.replace(/^\.+|\.+$/g, "");
    //remove http:// or https:// from the destination
    if (destination.includes("http://")) {
      destination = destination.replace("http://", "");
    }
    if (destination.includes("https://")) {
      destination = destination.replace("https://", "");
    }
    //remove html tags from the destination
    destination = destination.replace(/<[^>]*>/g, "");
    //remove any colons and stuff
    destination = destination.replace(/:|;|\?|\|\*|#/g, "");
    destination = destination.replace(/ /g, "-");
    //remove leading and trailing spaces
    destination = destination.trim();
    destination = destination.toLowerCase();

    let isResolver = false;
    let resolverExtension = "";
    let resolverActualExtension = ".eth";

    config.resolvers.forEach((resolver) => {
      if (destination.indexOf(resolver[0]) !== -1) {
        isResolver = true;
        destination = destination.split(".").slice(0, -1).join(".");
        resolverExtension = resolver[1] || ".eth";
        resolverActualExtension = resolver[0];
      }
    });

    if (destination.indexOf(".eth") !== -1)
      destination = destination.split(".").slice(0, -1).join(".");

    if (destination.length === 0)
      throw new Error("Please enter a destination to visit!");

    if (destination.length > 100) throw new Error("Destination is too long!");

    destination = destination + resolverActualExtension;
    WebEvents.emit("gotoDestination", destination);

    //gives time for animations to animates\
    await new Promise((resolve) =>
      setTimeout(() => {
        history.push(
          "/view/" + destination + (isResolver ? resolverExtension : ".eth")
        );
        resolve(true);
      }, 1000)
    );
  };

  const errorHandler = (error: any) => {
    setError(error.message);
    //fade out the error after 5 seconds
    clearTimeout(errorRef.current);
    errorRef.current = setTimeout(() => {
      setError(false);
    }, 10000);
  };

  //get the current destination from the box and goes to it
  const handleVisit = () => {
    setLoading(true);
    let destination = inputElement.current.value;
    gotoAddress(destination)
      .catch(errorHandler)
      .finally(() => {
        setLoading(false);
      });
  };

  //pick random tokenId from ENS and try and got to it...
  const handleTakeMeAnywhere = () => {
    setLoading(true);
    gotoAddress("xxx.eth")
      .catch(errorHandler)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full max-w-screen">
      <div className="alert alert-error shadow-lg mb-3" hidden={!error}>
        <div>
          <ErrorIcon />
          <span>
            <b className="mr-2">Error!</b>
            {error}
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="form-control w-full">
          <div className="input-group w-75">
            <input
              type="text"
              data-loading={loading}
              disabled={loading}
              ref={inputElement}
              maxLength={52}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVisit();
              }}
              onInput={() => {
                setHasInput(inputElement.current.value.length > 0);
              }}
              placeholder="Enter a destination..."
              className="input input-bordered w-full"
            />
            <button
              data-loading={loading}
              disabled={loading || !hasInput}
              className="btn bg-warning text-black w-25 hover:text-white hover:bg-black hover:text-yellow-500"
              onClick={handleVisit}
            >
              VISIT
            </button>
          </div>
        </div>
        <p className="text-1xl text-shadow bg-warning text-black p-1 mt-4 mb-1 hidden lg:block">
          <b>
            create your next <u>masterpiece</u> using the
          </b>
        </p>
        <button
          className="btn text-white bg-pink-500 hover:bg-purple-500 w-full mt-4 lg:mt-3 animate-pulse"
          data-loading={loading}
          disabled={loading}
          onClick={() => {
            history.push("/ide");
          }}
        >
          🎨 WEB.ETH STUDIO 🎨
        </button>
        <button
          className="btn text-white hover:bg-gray-500 w-full mt-4 sm:mt-2"
          data-loading={loading}
          disabled={loading}
          onClick={handleTakeMeAnywhere}
        >
          TAKE ME ANYWHERE
        </button>
      </div>
    </div>
  );
}

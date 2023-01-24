import React, { useRef, useState } from "react";
import ErrorIcon from "./Icons/ErrorIcon";
import WebEvents from "../webEvents";

export default function DestinationFinder() {
  const inputElement = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasInput, setHasInput] = useState(false);
  const errorRef = useRef(null);

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

    let isInfinityMint = false;
    if (
      destination.indexOf(".im") !== -1 ||
      destination.indexOf(".infinitymint") !== -1
    ) {
      isInfinityMint = true;
      destination = destination.split(".").slice(0, -1).join(".");
    }

    if (destination.indexOf(".eth") !== -1)
      destination = destination.split(".").slice(0, -1).join(".");

    if (destination.length === 0)
      throw new Error("Please enter a destination to visit!");

    if (destination.length > 100) throw new Error("Destination is too long!");

    destination = destination + (isInfinityMint ? ".infinitymint" : ".eth");

    //emit that we are going to this destination with the app wide event emitter
    WebEvents.emit("gotoDestination", destination);
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
    gotoAddress("xxx.eth")
      .catch(errorHandler)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full">
      <div className="alert alert-error shadow-lg mb-3" hidden={!error}>
        <div>
          <ErrorIcon />
          <span>
            <b className="mr-2">Error!</b>
            {error}
          </span>
        </div>
      </div>
      <div className="form-control lg:min-w-[54em] md:min-w-[46em]">
        <div className="input-group">
          <input
            type="text"
            data-loading={loading}
            disabled={loading}
            ref={inputElement}
            maxLength={150}
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
            className="btn bg-warning text-black w-[10em] hover:text-white hover:bg-black hover:text-yellow-500"
            onClick={handleVisit}
          >
            VISIT
          </button>
        </div>
        <button
          className="btn text-white hover:bg-pink-500 w-full mt-4"
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

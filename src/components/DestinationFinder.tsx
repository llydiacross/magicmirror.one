import React, { useRef, useState } from "react";
import ErrorIcon from "./Icons/ErrorIcon";

let errorTimeout: any;
export default function DestinationFinder() {
  const inputElement = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasInput, setHasInput] = useState(false);

  let gotoAddress = async (destination: string) => {
    destination = destination.toString();
    destination = destination.trim();
    destination = destination.split("eth")[0];
    if (destination[destination.length - 1] === ".")
      destination = destination.slice(0, -1);

    //remove http:// or https:// from the destination
    if (destination.includes("http://")) {
      destination = destination.replace("http://", "");
    }
    if (destination.includes("https://")) {
      destination = destination.replace("https://", "");
    }

    if (destination.length === 0)
      throw new Error("Please enter a destination to visit!");
  };

  //get the current destination from the box and goes to it
  const handleVisit = () => {
    setLoading(true);
    let destination = inputElement.current.value;
    gotoAddress(destination)
      .catch((error) => {
        setError(error.message);
        //clear the error after 5 seconds
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => {
          setError(false);
        }, 5000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //pick random tokenId from ENS and try and got to it...
  const handleTakeMeAnywhere = () => {
    gotoAddress("xxx.eth")
      .catch((error) => {
        setError(error.message);
        //fade out the error after 5 seconds
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => {
          setError(false);
        }, 5000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="alert alert-error shadow-lg" aria-hidden={!error}>
        <div>
          <ErrorIcon />
          <span>
            <b className="mr-2">Error!</b>
            {error}
          </span>
        </div>
      </div>
      <div className="form-control lg:min-w-[56em] md:min-w-[48em] w-full">
        <div className="input-group">
          <input
            type="text"
            data-loading={loading}
            disabled={loading}
            ref={inputElement}
            onInput={() => {
              setHasInput(inputElement.current.value.length > 0);
            }}
            placeholder="Enter a destination..."
            className="input input-bordered w-full"
          />
          <button
            data-loading={loading}
            disabled={loading || !hasInput}
            className="btn bg-warning text-black w-[10em] hover:text-white"
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
    </>
  );
}

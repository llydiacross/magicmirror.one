import React, { useRef } from "react";

export default function DestinationFinder() {
  const inputElement = useRef(null);

  const handleVisit = () => {
    let destination = inputElement.current.value;
  };

  return (
    <>
      <div className="form-control lg:min-w-[56em] md:min-w-[48em] w-full">
        <div className="input-group">
          <input
            type="text"
            ref={inputElement}
            placeholder="Enter a destination..."
            className="input input-bordered w-full"
          />
          <button
            className="btn btn-square bg-warning text-black w-[10em] hover:text-white"
            onClick={handleVisit}
          >
            VISIT
          </button>
        </div>
      </div>
    </>
  );
}

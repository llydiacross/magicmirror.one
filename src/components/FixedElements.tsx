import React from "react";

export default function FixedElements() {
  return (
    <>
      <div className="fixed top-0 right-0 ">
        <div className="flex flex-col">
          <img
            src={"/img/0x0zLogo.jpg"}
            alt="InfinityMint Logo"
            className="w-20"
          />
          <button className="btn btn-square rounded-none bg-transparent border-none text-white w-20 hover:text-black hover:bg-yellow-300">
            CONSOLE
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

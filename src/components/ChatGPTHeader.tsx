import React from "react";

export default function ChatGPTHeader({ hidden = false }) {
  return (
    <div className="hero pt-4" hidden={hidden}>
      <div className="hero-content text-center w-full bg-info">
        <div className="flex flex-col md:flex-row lg:flex-row gap-2 w-full pt-2">
          <div className="lg:pl-4 lg:ml-4 md:pl-2 md:ml-2">
            <p className="text-10xl animate-pulse md:hidden block lg:block lg:ml-5 mt-5 pt-5 lg:pl-5 md:ml-2 md:pl-2 lg:text-14x xl:text-giant text-black font-apocalypse text-center md:text-left xl:text-left">
              🤖
            </p>
          </div>
          <div className="p-2 w-full mt-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl text-black text-center md:text-right lg:text-right mb-4">
              Your new{" "}
              <u>
                <s>artificial</s>
              </u>{" "}
              best friend ❤️
            </h1>
            <div className="hidden md:block lg:block">
              <p className="text-black text-1xl lg:text-2xl text-right">
                Take advantage of AI to create your website.
              </p>
              <p className="text-black text-1xl lg:text-2xl  text-right">
                You can use it to create <u>anything</u> you like.
              </p>
              <p className="text-black text-1xl  lg:text-2xl  text-right">
                We make sure your creation is turned into a correct GPT-3
                prompt.
              </p>
              <p className="text-black text-1xl lg:text-2xl  text-right">
                You will receive back multiple solutions which you can preview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

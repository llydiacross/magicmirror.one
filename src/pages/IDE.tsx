import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/prism";
import "prismjs/themes/prism.css"; //Example style, you can use another
import FixedElements from "../components/FixedElements";
import HTMLRenderer from "../components/HTMLRenderer";

function IDE(props) {
  const [code, setCode] = React.useState(
    `<h1 class='text-7xl'>Welcome to Web.eth</h1>`
  );
  const [tab, setTabs] = React.useState({});
  const [showPreview, setShowPreview] = React.useState(true);
  const [showCode, setShowCode] = React.useState(true);
  const [codeBuffer, setCodeBuffer] = React.useState(code);
  const [overlayPreview, setOverlayPreview] = React.useState(false);
  const cooldown = useRef(null);

  return (
    <>
      <div className="flex flex-row w-full overflow-hidden pb-4 mb-4">
        <div
          className="w-full overflow-y-scroll min-h-screen max-h-screen"
          hidden={!showCode || (overlayPreview && !showPreview)}
        >
          <Editor
            value={code}
            onValueChange={(code) => {
              setCode(code);
              //wait for the user to stop typing
              clearTimeout(cooldown.current);
              cooldown.current = setTimeout(() => {
                setCodeBuffer(code);
              }, 800);
            }}
            highlight={(code) => highlight(code, languages.html)}
            padding={24}
            className="z-50"
            spellCheck={true}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              marginTop: 50,
              background: "rgba(0,0,0,0.1)",
              ...(!overlayPreview ? { border: "1px solid black" } : {}),
            }}
          />
          <div
            className="inline-flex fixed top-0 left-0 rounded-sm border-1 shadow-sm w-[50%] overflow-hidden z-50"
            role="group"
          >
            <button className="btn rounded-none bg-success border-none text-white w-[20%] hover:text-white hover:bg-black">
              HTML
            </button>
            <button className="btn rounded-none bg-primary border-none text-white w-[20%]  hover:text-white hover:bg-black">
              CSS
            </button>
            <button className="btn rounded-none bg-secondary border-none text-white w-[20%]  hover:text-white hover:bg-black">
              JS
            </button>
            <button className="btn rounded-none bg-warning border-none text-white w-[20%] hover:text-white hover:bg-black">
              .xens
            </button>
            <button className="btn rounded-none bg-black border-none text-white w-[20%] hover:text-white hover:bg-light">
              ⚙️
            </button>
          </div>
        </div>
        <div
          className={"h-full mb-0 " + (showPreview ? "w-full" : "w-auto")}
          style={{
            borderLeft: "1px solid black",
            ...(overlayPreview
              ? {
                  position: "absolute",
                  left: "0",
                  opacity: 0.4,
                }
              : {}),
          }}
        >
          <div
            hidden={!showPreview}
            className={"h-full w-full"}
            style={{
              ...(overlayPreview
                ? {
                    pointerEvents: "none",
                    touchEvents: "none",
                    paddingTop: 20,
                    marginTop: 40,
                    width: "90%",
                    marginLeft: "5%",
                    paddingLeft: 20,
                  }
                : {}),
            }}
          >
            <HTMLRenderer
              thatHtml={codeBuffer}
              style={{
                ...(!overlayPreview
                  ? {
                      height: "93vh",
                      border: "1px solid black",
                    }
                  : {}),
              }}
            />
          </div>
          <div
            className={
              "w-full bg-gray-700 border-1 border-black z-50 " +
              (!showPreview ? "flex flex-col" : "") +
              " " +
              (overlayPreview ? "h-40 pt-5 mt-4" : "")
            }
          >
            <button
              className="btn rounded-none bg-pink-500 border-none text-white hover:text-white hover:bg-black"
              onClick={() => setShowPreview(!showPreview)}
            >
              {!showPreview ? "Show Preview" : "Hide Preview"}
            </button>
            <button
              className="btn rounded-none bg-pink-500 border-none text-white hover:text-white hover:bg-black"
              onClick={() => setShowCode(!showCode)}
            >
              {!showCode ? "Show Code" : "Hide Code"}
            </button>
            <button
              className="btn rounded-none bg-pink-500 border-none text-white hover:text-white hover:bg-black"
              onClick={() => setOverlayPreview(!overlayPreview)}
            >
              {!overlayPreview ? "Overlay Preview" : "Stop Overlaying Preview"}
            </button>
            <button
              className="btn rounded-none bg-transparent bg-success border-none text-white hover:text-white hover:bg-black"
              onClick={() => setShowPreview(!showPreview)}
            >
              Publish
            </button>
            <button
              className="btn rounded-none bg-transparent bg-info border-none text-white hover:text-white hover:bg-black"
              onClick={() => setShowPreview(!showPreview)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {overlayPreview ? (
        <>
          <br />
          <br />
        </>
      ) : (
        <></>
      )}
      <FixedElements
        hideAlerts={true}
        hideSettings={true}
        hideFooter={!showCode}
      />
    </>
  );
}

IDE.propTypes = {};

export default IDE;

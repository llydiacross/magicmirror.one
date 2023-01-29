import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const CharacterSet = [
  "📁",
  "🗄️",
  "🚕",
  "⛽",
  "✈️",
  "🗿",
  "🪐",
  "🛸",
  "🚀",
  "🌈",
];
let Count = [];
let hasUnmounted = false;
let timeout;
let AddEmoji = (settings) => {
  //keep icons below the max icons limit
  if (Count.length >= (settings?.maxIcons || 246)) {
    Count[0].remove();
    Count = Count.slice(1);
  }

  let id = document.getElementById("loadingIcons");
  if (id === null) {
    return 2;
  }

  let elm = document.createElement("p");
  elm.innerHTML =
    Object.values(CharacterSet)[
      Math.floor(Math.random() * CharacterSet.length)
    ];

  if (Math.floor(Math.random() * 100) < 25)
    elm.innerHTML = `<span class='loadingIconEquipable'>${"☂️"}</span>${
      elm.innerHTML
    }`;

  if (Math.floor(Math.random() * 100) < 10)
    elm.innerHTML = `<span class='loadingIconEquipable' style='margin-top: 2px !important; margin-left: -12px !important'>${"🔫"}</span>${
      elm.innerHTML
    }`;

  if (Math.floor(Math.random() * 100) < 5)
    elm.innerHTML = `<span class='loadingIconEquipable' style='margin-top: 10px !important; margin-left: 10px !important'>${"✏️"}</span>${
      elm.innerHTML
    }`;

  elm.className = "loadingIcon";
  elm.style.paddingTop =
    Math.floor(Math.random() * (settings?.range || 100)).toString() + "px";
  elm.style.animationDuration =
    Math.max(
      settings?.minSpeed || 15,
      Math.floor(Math.random() * (settings?.speed || 30))
    ).toString() + "s";

  try {
    id.append(elm);
    Count.push(elm);
  } catch (error) {}

  return Math.random() * (settings?.maxWaitTime || 32);
};

const startLoop = (SaveSettings) => {
  timeout = (seconds = 1) => {
    seconds = Math.max(1, seconds);
    setTimeout(() => {
      if (!hasUnmounted) timeout(AddEmoji(SaveSettings));
    }, seconds * 1000);
  };
  timeout();
};

const Loading = ({
  settings,
  loadingReason = "Loading",
  showLoadingBar = true,
  loadingPercentage = 0,
}) => {
  useEffect(() => {
    startLoop(settings);

    return () => {
      hasUnmounted = true;
      Count.forEach((val) => {
        try {
          val.remove();
        } catch (error) {}
      });
    };
  }, [settings]);

  if (hasUnmounted) return <></>;

  return (
    <div className="text-center mt-4">
      <div className="flex flex-col p-2">
        <div className="text-white overflow-hidden border-2 p-2">
          <div className="relative" id="loadingIcons"></div>
          <div className="items-center mb-2 mt-4">
            <div>
              <p className="text-6xl">
                Doing Things
                <span className="spinText absolute ml-5">🔨</span>
              </p>
              {loadingReason !== undefined && loadingReason !== null ? (
                <p className="text-2xl mt-2 underline">{loadingReason}</p>
              ) : (
                <></>
              )}
              {showLoadingBar &&
              loadingPercentage !== undefined &&
              !isNaN(loadingPercentage) ? (
                <div className="w-full mt-2 pt-4">
                  <progress
                    className="progress w-full"
                    value={loadingPercentage}
                    max="100"
                  ></progress>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Loading.propTypes = {
  settings: PropTypes.string,
};

export default Loading;

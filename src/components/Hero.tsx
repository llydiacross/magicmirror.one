import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DestinationFinder from "./DestinationFinder";
import WebEvents from "../webEvents";
import storage from "../storage";

/**
 * Might move these to a config file...
 */
const destinations = [
  "xxx.eth",
  "web.eth",
  "infinitymint.eth",
  "eastern.eth",
  "western.eth",
  "central.eth",
  "northern.eth",
  "southern.eth",
  "far-east.eth",
  "far-west.eth",
  "far-north.eth",
  "far-south.eth",
  "far-eastern.eth",
  "far-western.eth",
  "far-northern.eth",
  "far-southern.eth",
  "vitalik.eth",
  "ytcracker.eth",
  "rms.eth",
  "elon.eth",
  "bill-gates.eth",
  "jeff-bezos.eth",
  "jack-dorsey.eth",
  "jack-ma.eth",
  "paul-graham.eth",
  "paul-omar.eth",
  "satoshi.eth",
  "jimmy-wales.eth",
  "jimmy-song.eth",
  "jimmy-dorsey.eth",
  "jimmy-ma.eth",
  "jimmy-graham.eth",
  "jimmy-omar.eth",
  "eleanor-omar.eth",
  "tim-berners-lee.eth",
  "linus-torvalds.eth",
  "linus-omar.eth",
  "linus-graham.eth",
  "linus-song.eth",
  "linus-dorsey.eth",
  "linus-ma.eth",
  "iain-maclaren.eth",
  "james-montgomery.eth",
  "lord-randolph.eth",
  "martha-washington.eth",
  "george-washington.eth",
  "john-adams.eth",
  "thomas-jefferson.eth",
  "james-madison.eth",
  "james-monroe.eth",
  "fish.eth",
  "cat.eth",
  "dog.eth",
  "bird.eth",
  "fish.eth",
  "snake.eth",
  "frog.eth",
  "cow.eth",
  "pig.eth",
  "chicken.eth",
  "goat.eth",
  "0xDorothy.eth",
  "0xToto.eth",
  "0xScarecrow.eth",
  "0xTinMan.eth",
  "0xLion.eth",
  "0xGlinda.eth",
  "0xWizardOfOz.eth",
  "0xWickedWitchOfTheWest.eth",
  "0xWickedWitchOfTheEast.eth",
  "0xFlyingMonkeys.eth",
  "0xWizard",
  "track1.sow3.🎧club.eth",
  "track2.sow3.🎧club.eth",
  "track3.sow3.🎧club.eth",
  "track4.sow3.🎧club.eth",
  "track5.sow3.🎧club.eth",
  "track6.sow3.🎧club.eth",
  "track7.sow3.🎧club.eth",
  "track8.sow3.🎧club.eth",
  "track9.sow3.🎧club.eth",
  "track10.sow3.🎧club.eth",
  "🎧club.eth",
  "sow3.eth",
  "sow3.🎧club.eth",
  "deer.eth",
  "rabbit.eth",
  "fox.eth",
  "bear.eth",
  "wolf.eth",
  "lion.eth",
  "tiger.eth",
  "elephant.eth",
  "giraffe.eth",
  "rhino.eth",
  "hippo.eth",
  "zebra.eth",
  "gorilla.eth",
  "monkey.eth",
  "panda.eth",
  "koala.eth",
  "penguin.eth",
  "dolphin.eth",
  "whale.eth",
  "shark.eth",
  "seal.eth",
  "octopus.eth",
  "squid.eth",
  "crab.eth",
  "lobster.eth",
  "shrimp.eth",
  "salmon.eth",
  "trout.eth",
  "eel.eth",
  "frog.eth",
  "toad.eth",
  "lizard.eth",
  "snake.eth",
  "turtle.eth",
  "chameleon.eth",
  "iguana.eth",
  "alligator.eth",
  "jimmy.eth",
  "jimmy-omar.eth",
  "jimmy-song.eth",
  "jimmy-dorsey.eth",
  "jimmy-ma.eth",
  "jimmy-graham.eth",
  "jimmy-omar.eth",
];

//handle for the typeWriter animation
function Hero({ theme, children }) {
  const [currentTheme, setCurrentTheme] = useState(theme || null);
  const eventEmitterCallbackRef = useRef(null);
  const themeRef = useRef(theme || null);

  //code for the h1 text animation is in the animation.ts file
  useEffect(() => {
    if (
      themeRef.current === null &&
      storage.getGlobalPreference("default_theme")
    )
      setCurrentTheme(storage.getGlobalPreference("default_theme"));

    if (eventEmitterCallbackRef.current === null) {
      eventEmitterCallbackRef.current = () => {
        if (
          themeRef.current === null &&
          storage.getGlobalPreference("default_theme")
        )
          setCurrentTheme(storage.getGlobalPreference("default_theme"));
      };
    }

    WebEvents.on("reload", eventEmitterCallbackRef.current);

    return () => {
      WebEvents.off("reload", eventEmitterCallbackRef.current);
    };
  }, []);

  return (
    <div
      className="hero min-h-screen bg-base-200 w-full z-50"
      data-theme={currentTheme}
    >
      {children}
    </div>
  );
}

Hero.propTypes = {
  theme: PropTypes.string,
  title: PropTypes.string,
  initialText: PropTypes.string,
  children: PropTypes.node,
  showFinder: PropTypes.bool,
  typeWriterSpeed: PropTypes.number,
};

export default Hero;

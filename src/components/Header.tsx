import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import DestinationFinder from "./DestinationFinder";
import WebEvents from "../webEvents";

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

function Header({ theme, title }) {
  let pickDestinationHandle = useRef(null);
  let typeWriterHandle = useRef(null);
  //to allow more than one header
  let typeWriterElement = useRef(
    `#${btoa(Math.floor(Math.random() * 100000).toString())}`
  );

  //code for the h1 text animation is in the animation.ts file
  useEffect(() => {
    //cb for the typeWriter animation
    let cb = (destination: string) => {
      if (typeWriterHandle.current) clearTimeout(typeWriterHandle.current);
      if (pickDestinationHandle.current)
        clearTimeout(pickDestinationHandle.current);

      text.innerHTML = "";
      buffer = "";
      i = 0;
      txt = destination;
      typeWriter();
    };

    WebEvents.off("gotoDestination", cb);
    WebEvents.on("gotoDestination", cb);

    if (!document.getElementById(typeWriterElement.current))
      throw new Error(`no element with id ${typeWriterElement.current} found`);

    //fixes reloading
    if (pickDestinationHandle.current)
      clearTimeout(pickDestinationHandle.current);

    let text = document.getElementById(typeWriterElement.current);
    // make the text animate like a typewriter
    let i = 0;
    let txt = " Where will you go today?";
    let speed = 50;
    let buffer = "";

    let typeWriter = (doRandomName?: boolean) => {
      if (i < txt.length) {
        buffer += txt.charAt(i);
        text.innerHTML = buffer;
        i++;
        typeWriterHandle.current = setTimeout(
          () => typeWriter(doRandomName),
          speed
        );
      } else {
        text.innerHTML = text.innerHTML + "<span class='blink-text'>_</span>";

        if (doRandomName)
          pickDestinationHandle.current = setTimeout(() => {
            randomNames();
          }, 1000 * Math.floor(Math.random() * 10) + 6000);
        else {
          if (pickDestinationHandle.current)
            clearTimeout(pickDestinationHandle.current);
          if (typeWriterHandle.current) clearTimeout(typeWriterHandle.current);
        }
      }
    };

    let randomNames = () => {
      text.innerHTML = "";
      buffer = "";
      i = 0;
      let randomIndex = Math.floor(Math.random() * destinations.length);
      txt = `${destinations[randomIndex]}`;
      typeWriter(true);
    };

    buffer = "";
    text.innerHTML = "";
    if (!typeWriterHandle.current) typeWriter(true);
  }, []);

  return (
    <div
      className="hero min-h-screen bg-base-200"
      data-theme={theme || "luxury"}
    >
      <div className="hero-content text-center">
        <div className="flex flex-col gap-4">
          {/** mobile title */}

          <h1 className="text-8xl md:hidden lg:hidden font-apocalypse text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
            {!title || title.length === 0 ? "web.eth" : title}
          </h1>
          {/** tablet/desktop title */}
          <h1 className="text-giant hidden md:block lg:block font-apocalypse text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
            {!title || title.length === 0 ? "web.eth" : title}
          </h1>

          <h1
            className="text-2xl bg-warning text-black lg:text-5xl font-bold p-2"
            id={typeWriterElement.current}
          >
            Where will you go today?
          </h1>
          <DestinationFinder />
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  theme: PropTypes.string,
  title: PropTypes.string,
};

export default Header;

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import DestinationFinder from "./DestinationFinder";

const locations = [
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
];

//handle for the typeWriter animation
let handle: any;

function Header({ theme }) {
  //code for the h1 text animation is in the animation.ts file
  useEffect(() => {
    if (!document.getElementById("animated-text"))
      throw new Error('no element with id "animated-text" found');

    let text = document.getElementById("animated-text");
    // make the text animate like a typewriter
    let i = 0;
    let txt = text.textContent;
    let buffer = "";
    let speed = 50;

    //fixes reloading
    if (handle) clearTimeout(handle);

    let typeWriter = () => {
      if (i < txt.length) {
        buffer += txt.charAt(i);
        text.innerHTML = buffer;
        i++;
        setTimeout(typeWriter, speed);
      } else {
        text.innerHTML = text.innerHTML + "<span class='blink-text'>_</span>";
        handle = setTimeout(() => {
          randomNames();
        }, 1000 * Math.floor(Math.random() * 10) + 10000);
      }
    };

    let randomNames = () => {
      text.innerHTML = "";
      buffer = "";
      i = 0;
      let randomIndex = Math.floor(Math.random() * locations.length);
      txt = `${locations[randomIndex]}`;
      typeWriter();
    };

    text.innerHTML = "";
    typeWriter();
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
            www.eth
          </h1>
          {/** tablet/desktop title */}
          <h1 className="text-giant hidden md:block lg:block font-apocalypse text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
            www.eth
          </h1>
          <h1
            className="text-2xl bg-warning text-black lg:text-5xl font-bold p-2"
            id="animated-text"
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
};

export default Header;

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DestinationFinder from './DestinationFinder';
import WebEvents from '../webEvents';
import storage from '../storage';

/**
 * Might move these to a config file...
 */
const destinations = [
  //EADS.eth can control sponsored destinations
  'infinitymint.eth',
  '0x0z.agency',
  '0x0z.xyz',
  '0x0z.me',
  '0x0z.eth',
  '0x0z🏡.eth',
  '0x0z.nft',
  '0x0z.dao',
  '0x0z🟨🧙🏼‍♂👠🐶😱🦁🤖🧙🏻‍♀.eth',
  '0x🟨Road.eth',
  '0xWizardof0x.eth',
  '0x0z🟨🧙🏼‍♂👠😱🦁🥫🧙🏻‍♀.eth',
  '0xScarecrow.eth',
  '0xTinman.eth',
  '0xLionheart.eth',
  '0xWitch.eth',
  '0xToto.eth',
  'NFTofME.eth',
  'NFTofME.NFT',
  'NFTofME.DAO',
  'NFTofME.wallet',
  'HomoLudens.x',
  'HomoLudens.NFT',
  'HomoLudens.wallet',
  'HomoLudens.DAO',
  'MagicMirror.NFT',
  'Magic🪞.eth',
  '📻Station.eth',
  '🕹Club.eth',
  '🧚‍♀️Forest.eth',
  '🖼Farm.eth',
  '🍳Book.eth',
  '⚖️Center.eth',
  '🍄Kingdom.eth',
  '♾Archive.eth',
  'Class🍎Room.eth',
  '👾Bestiary.eth',
  '🍬land.eth',
  '⭐️Atlas.eth',
  '🌷Graveyard.eth',
  'carpe☀diem.eth',
  'EADS.eth',
  '☢rads.eth',
  'EGPS.eth',
  '📍egps.eth',
  'b0b🔧w3b.eth',
  'charlottes🕸.eth',
  'GMArena.eth',
  'GMArena🏟.eth',
  'Free📧.eth',
  '🎫Mint.eth',
  '🥠Factory.eth',
  'TicketMint.eth',
  'NewTube.eth',
  '🏴‍☠🌊.eth',
  '🏴‍☠️Sea.eth',
  'PirateSea.eth',
  'UnderThe🌊.eth',
  'UnderTheSea.eth',
  'achieveMINT.eth',
  'StayOnTarget.eth',
  'StayOn🎯.eth',
  'MonoNFTism.eth',
  'PortRoyal🏝.eth',
  '🎒Attack.eth',
  'Dream🎨.eth',
  '👑Label.eth',
  '👟Mint.eth',
  '👟Club.eth',
  'Imapact🎛.eth',
  'Tech🏜.eth',
  '🌎Sport.eth',
  '🧱Jungle.eth',
  '🧢Mint.eth',
  '🧢Shop.eth',
  '🎮Shop.eth',
  'Travel🌎.eth',
  '💾Depot.eth',
  '🚗City.eth',
  '🚀Launcher.eth',
  '⛽️Nation.eth',
  '🚮Town.eth',
  '🦙Kicker.eth',
  '🎄Village.eth',
  'Liquid😻.eth',
  'Botanical🎋.eth',
  '🎞Fest.eth',
  '🥳Time.eth',
  'Legal🦅.eth',
  '⚖️Center.eth',
  '🥚Hunt.eth',
  '🌪Watch.eth',
  '🦕Land.eth',
  'Lucky🎰.eth',
  'Collab🏖.eth',
  '🧼Club.eth',
  '🗺Mint.eth',
  '💎Cold.eth',
  '🧧Day.eth',
  'Charity🔮.eth',
  '🏞Trail.eth',
  'eastern.eth',
  'western.eth',
  'central.eth',
  'northern.eth',
  'southern.eth',
  'far-east.eth',
  'far-west.eth',
  'far-north.eth',
  'far-south.eth',
  'far-eastern.eth',
  'far-western.eth',
  'far-northern.eth',
  'far-southern.eth',
  'vitalik.eth',
  'ytcracker.eth',
  'rms.eth',
  'elon.eth',
  'bill-gates.eth',
  'jeff-bezos.eth',
  'jack-dorsey.eth',
  'jack-ma.eth',
  'paul-graham.eth',
  'paul-omar.eth',
  'satoshi.eth',
  'jimmy-wales.eth',
  'jimmy-song.eth',
  'jimmy-dorsey.eth',
  'jimmy-ma.eth',
  'jimmy-graham.eth',
  'jimmy-omar.eth',
  'eleanor-omar.eth',
  'tim-berners-lee.eth',
  'linus-torvalds.eth',
  'linus-omar.eth',
  'linus-graham.eth',
  'linus-song.eth',
  'linus-dorsey.eth',
  'linus-ma.eth',
  'iain-maclaren.eth',
  'james-montgomery.eth',
  'lord-randolph.eth',
  'martha-washington.eth',
  'george-washington.eth',
  'john-adams.eth',
  'thomas-jefferson.eth',
  'james-madison.eth',
  'james-monroe.eth',
  'fish.eth',
  'cat.eth',
  'dog.eth',
  'bird.eth',
  'fish.eth',
  'snake.eth',
  'frog.eth',
  'cow.eth',
  'pig.eth',
  'chicken.eth',
  'goat.eth',
  '0xDorothy.eth',
  '0xToto.eth',
  '0xScarecrow.eth',
  '0xTinMan.eth',
  '0xLionheart.eth',
  '0xWitch.eth',
  '0xWizardOfOz.eth',
  '0xMunchkin.eth',
  'track1.sow3.🎧club.eth',
  'track2.sow3.🎧club.eth',
  'track3.sow3.🎧club.eth',
  'track4.sow3.🎧club.eth',
  'track5.sow3.🎧club.eth',
  'track6.sow3.🎧club.eth',
  'track7.sow3.🎧club.eth',
  'track8.sow3.🎧club.eth',
  'track9.sow3.🎧club.eth',
  'track10.sow3.🎧club.eth',
  '🎧club.eth',
  'sow3.eth',
  'sow3.🎧club.eth',
  'deer.eth',
  'rabbit.eth',
  'fox.eth',
  'bear.eth',
  'wolf.eth',
  'lion.eth',
  'tiger.eth',
  'elephant.eth',
  'giraffe.eth',
  'rhino.eth',
  'hippo.eth',
  'zebra.eth',
  'gorilla.eth',
  'monkey.eth',
  'panda.eth',
  'koala.eth',
  'penguin.eth',
  'dolphin.eth',
  'whale.eth',
  'shark.eth',
  'seal.eth',
  'octopus.eth',
  'squid.eth',
  'crab.eth',
  'lobster.eth',
  'shrimp.eth',
  'salmon.eth',
  'trout.eth',
  'eel.eth',
  'frog.eth',
  'toad.eth',
  'lizard.eth',
  'snake.eth',
  'turtle.eth',
  'chameleon.eth',
  'iguana.eth',
  'alligator.eth',
  'jimmy.eth',
  'jimmy-omar.eth',
  'jimmy-song.eth',
  'jimmy-dorsey.eth',
  'jimmy-ma.eth',
  'jimmy-graham.eth',
  'jimmy-omar.eth',
];

// Handle for the typeWriter animation
function Header({
  theme,
  title,
  typeWriterSpeed = 50,
  initialText = 'Where will you go today?',
  showFinder = true,
}) {
  const pickDestinationHandle = useRef(null);
  const typeWriterHandle = useRef(null);
  // To allow more than one header
  const typeWriterElement = useRef(
    `#${btoa(Math.floor(Math.random() * 100000).toString())}`
  );
  const [currentTheme, setCurrentTheme] = useState(theme || null);
  const speedRef = useRef(typeWriterSpeed);
  const textRef = useRef(initialText);
  const callbackRef = useRef(null);
  const writeTextRef = useRef(null);
  const eventEmitterCallbackRef = useRef(null);
  const themeRef = useRef(theme || null);

  // Code for the h1 text animation is in the animation.ts file
  useEffect(() => {
    if (
      themeRef.current === null &&
      storage.getGlobalPreference('defaultTheme')
    ) {
      setCurrentTheme(storage.getGlobalPreference('defaultTheme'));
    }

    if (eventEmitterCallbackRef.current === null) {
      eventEmitterCallbackRef.current = () => {
        if (
          themeRef.current === null &&
          storage.getGlobalPreference('defaultTheme')
        ) {
          setCurrentTheme(storage.getGlobalPreference('defaultTheme'));
        }
      };
    }

    WebEvents.off('reload', eventEmitterCallbackRef.current);
    WebEvents.on('reload', eventEmitterCallbackRef.current);

    // Cb for the typeWriter animation
    callbackRef.current = (destination: string) => {
      if (typeWriterHandle.current) clearTimeout(typeWriterHandle.current);
      if (pickDestinationHandle.current) {
        clearTimeout(pickDestinationHandle.current);
      }

      text.innerHTML = '';
      buffer = '';
      i = 0;
      txt = destination;
      writeTextRef.current();
    };

    WebEvents.off('gotoDestination', callbackRef.current);
    WebEvents.on('gotoDestination', callbackRef.current);

    if (!document.getElementById(typeWriterElement.current)) {
      throw new Error(`no element with id ${typeWriterElement.current} found`);
    }

    // Fixes reloading
    if (pickDestinationHandle.current) {
      clearTimeout(pickDestinationHandle.current);
    }

    const text = document.getElementById(typeWriterElement.current);
    // Make the text animate like a typewriter
    let i = 0;
    let txt = textRef.current;
    let buffer = '';

    writeTextRef.current = (doRandomName?: boolean) => {
      if (i < txt.length) {
        buffer += txt.charAt(i);
        text.innerHTML = buffer;
        i++;
        typeWriterHandle.current = setTimeout(
          () => writeTextRef.current(doRandomName),
          speedRef.current
        );
      } else {
        text.innerHTML = text.innerHTML + "<span class='blink-text'>_</span>";

        if (doRandomName) {
          pickDestinationHandle.current = setTimeout(() => {
            randomNames();
          }, 1000 * Math.floor(Math.random() * 10) + 6000);
        } else {
          if (pickDestinationHandle.current) {
            clearTimeout(pickDestinationHandle.current);
          }
          if (typeWriterHandle.current) clearTimeout(typeWriterHandle.current);
        }
      }
    };

    const randomNames = () => {
      text.innerHTML = '';
      buffer = '';
      i = 0;
      const randomIndex = Math.floor(Math.random() * destinations.length);
      txt = `${destinations[randomIndex]}`;
      writeTextRef.current(true);
    };

    buffer = '';
    text.innerHTML = '';

    if (!typeWriterHandle.current && writeTextRef.current !== null) {
      writeTextRef.current(true);
    }

    return () => {
      WebEvents.off('gotoDestination', callbackRef.current);
      WebEvents.off('reload', eventEmitterCallbackRef.current);
    };
  }, []);

  return (
    <div
      className="hero min-h-screen max-w-screen bg-base-200"
      data-theme={currentTheme}
    >
      <div className="hero-content text-center w-[100%] md:w-[80%] lg:w-[80%] lg:max-w-[80vw] md:max-w-[80vw] max-w-[95vw]">
        <div className="flex flex-col gap-4 lg:gap-3 w-full">
          {/** Mobile title */}
          <div className="max-w-screen mb-2">
            <h1 className="text-6xl md:hidden lg:hidden title max-w-screen">
              {!title || title.length === 0 ? 'Magic🪞.eth' : title}
            </h1>
            {/** Tablet/desktop title */}
            <h1 className="text-8xl hidden md:block lg:block title max-w-screen">
              {!title || title.length === 0 ? 'Magic🪞.eth' : title}
            </h1>
          </div>
          <div className="mt-2 max-w-screen w-full">
            <h1
              className="text-2xl text-accent bg-primary lg:text-5xl p-2 mb-4 max-w-screen"
              id={typeWriterElement.current}
            >
              {/** The initial input is controlled by a prop */}
            </h1>
            {showFinder ? <DestinationFinder /> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  theme: PropTypes.string,
  title: PropTypes.string,
  initialText: PropTypes.string,
  showFinder: PropTypes.bool,
  typeWriterSpeed: PropTypes.number,
};

export default Header;

import React, { useContext, useState, useRef, useEffect } from 'react'
import Header from '../components/Header'
import FixedElements from '../components/FixedElements'
import SettingsModal from '../modals/SettingsModal'
import Hero from '../components/Hero'
import { ENSContext } from '../contexts/ensContext'
import WebEvents from '../webEvents'

export default function Index () {
  const [shouldShowSettings, setShouldShowSettings] = useState(false)
  const [shouldShowBackdrop, setShouldShowBackdrop] = useState(false)
  const [currentDestination, setCurrentDestination] = useState(null)
  const ensContext = useContext(ENSContext)
  const cooldown = useRef(null)

  useEffect(() => {
    if (cooldown.current === null) {
      cooldown.current = (destination) => {
        setShouldShowBackdrop(true)
        setCurrentDestination(destination)
      }
    }

    // might cause trouble
    window.scrollTo(0, 0)

    WebEvents.off('gotoDestination', cooldown.current)
    WebEvents.on('gotoDestination', cooldown.current)

    return () => {
      WebEvents.off('gotoDestination', cooldown.current)
    }
  }, [])
  return (
    <>
      <div
        className='hero-bg w-full h-screen absolute z-0 animate-pulse bg-cover bg-center backdrop-saturate-100 backdrop-opacity-20'
        hidden={!shouldShowBackdrop}
        style={{
          backgroundImage: `url("${ensContext.avatar}")`
        }}
      />
      <div
        className='hero-bg w-full h-screen absolute z-0 overflow-hidden bg-cover bg-center  bg-black'
        hidden={
          !shouldShowBackdrop ||
          ensContext.avatar === null ||
          ensContext.avatar.length === 0
        }
        style={{ opacity: 0.75 }}
      />
      <Header title={currentDestination} />
      <Hero>
        <div className='hero-content text-center w-full bg-warning pb-5 mb-5'>
          <div className='flex flex-col md:flex-row lg:flex-row gap-2 w-full pt-5'>
            <div className='lg:pl-5 lg:ml-5 md:pl-2 md:ml-2'>
              <p className='text-10xl lg:ml-5 lg:pl-5 md:ml-2 md:pl-2 lg:text-14x xl:text-giant text-black font-apocalypse text-center md:text-left xl:text-left'>
                LETS BUILD
              </p>
            </div>
            <div className='p-4'>
              <h1 className='text-3xl md:text-5xl lg:text-7xl text-black text-right font-bold mb-4 pb-4'>
                Harness the power of <u>decentralized web</u> to create{' '}
                <u>something magical</u>
              </h1>
              <p className='text-black text-1xl lg:text-2xl text-right'>
                We've made an easy online IDE for you to use.
              </p>
              <p className='text-black text-1xl lg:text-2xl  text-right'>
                You can use it to create <u>anything</u> you like.
              </p>
              <p className='text-black text-1xl lg:text-2xl text-right'>
                We make sure your creation is safe.
              </p>
              <p className='text-black text-1xl lg:text-2xl text-right'>
                Your creation is saved to IPFS.
              </p>
              <p className='text-black text-1xl lg:text-2xl text-right'>
                Deploy <u>smart contracts</u> to empower your creation.
              </p>
            </div>
          </div>
        </div>
      </Hero>
      {/** Contains the footer and the 0x0zLogo with the console button */}
      <FixedElements
        hideUserInfo={false}
        hideOwnership
        onSettings={() => {
          setShouldShowSettings(!shouldShowSettings)
        }}
      />
      <SettingsModal
        hidden={!shouldShowSettings}
        onHide={() => {
          setShouldShowSettings(false)
        }}
      />
    </>
  )
}

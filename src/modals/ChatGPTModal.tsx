import React, { useRef, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import storage from '../storage'
import { Web3Context } from '../contexts/web3Context'
import WebEvents from '../webEvents'
import ChatGPTHeader from '../components/ChatGPTHeader'
import { useHistory } from 'react-router-dom'
import HeartIcon from '../components/Icons/HeartIcon'
import ViewIcon from '../components/Icons/ViewIcon'
import Loading from '../components/Loading'
import { fetchPrompt } from '../gpt3'
import Editor from 'react-simple-code-editor'

import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-dark.css'

function ChatGPTModal ({
  hidden,
  onHide,
  savedData = {},
  onSetHTML = (code) => {}
}) {
  // eslint-disable-next-line no-unused-vars
  const context = useContext(Web3Context)
  const [loading, setLoading] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('dracula')
  const eventEmitterCallbackRef = useRef(null)

  const [percentage, setPercentage] = useState(0)
  const [hasInput, setHasInput] = useState(false)
  const [gptResult, setGptResult] = useState(null)
  const [gptError, setGptError] = useState(null)
  const abortRef = useRef(null)
  const inputElement = useRef(null)
  const tempElement = useRef(null)
  const nElement = useRef(null)
  // eslint-disable-next-line no-unused-vars
  const history = useHistory()

  useEffect(() => {
    if (storage.getGlobalPreference('default_theme')) { setCurrentTheme(storage.getGlobalPreference('default_theme')) }

    if (eventEmitterCallbackRef.current === null) {
      eventEmitterCallbackRef.current = () => {
        if (storage.getGlobalPreference('default_theme')) { setCurrentTheme(storage.getGlobalPreference('default_theme')) }
      }
    }

    WebEvents.off('reload', eventEmitterCallbackRef.current)
    WebEvents.on('reload', eventEmitterCallbackRef.current)

    return () => {
      if (abortRef.current !== null) abortRef.current.abort()
      WebEvents.off('reload', eventEmitterCallbackRef.current)
    }
  }, [])

  // disables scrolling while this modal is active
  useEffect(() => {
    if (!hidden) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [hidden])

  const temp = 0.6
  const sureness =
    gptResult?.choices?.length === undefined && gptResult?.choices?.length === 0
      ? 0
      : Math.min(
        100,
        Math.floor(
          100 / Math.min(100, (gptResult?.choices?.length || 0) * temp)
        )
      )

  return (
    <div
      data-theme={currentTheme}
      className="mx-auto sm:w-3/5 md:w-3/5 lg:w-4/5 fixed inset-0 flex items-center overflow-y-auto z-50 bg-transparent"
      hidden={hidden}
    >
      <div className="bg-white rounded-md w-full overflow-y-auto max-h-screen shadow shadow-lg border-2">
        <div className="flex flex-col w-full">
          <div className="bg-info p-2 text-black text-3xl">
            <b>🤖</b>
          </div>
          <div className="flex flex-col p-2 w-full mt-2">
            <p className="text-2xl mb-2 text-black">
              <b>GPT-3 Stats</b>
            </p>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <HeartIcon />
                </div>
                <div className="stat-title">Solution Rating</div>
                <div className="stat-value text-primary">{sureness}%</div>
                <div className="stat-desc">
                  {sureness > 50 ? 'Good' : 'Bad'}
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-primary">
                  <ViewIcon />
                </div>
                <div className="stat-title">Amount of Solutions</div>
                <div className="stat-value text-primary">
                  {gptResult?.choices?.length || 0}
                </div>
                <div className="stat-desc">0.6 Temperature</div>
              </div>
            </div>
            {!loading
              ? (
              <ChatGPTHeader hidden={gptResult !== null} />
                )
              : (
              <Loading loadingPercentage={percentage} />
                )}

            {gptError !== null
              ? (
              <div className="alert alert-error mt-4 w-full">
                {gptError?.message}
              </div>
                )
              : (
              <></>
                )}
            <div className="flex flex-col mt-4">
              <div className="form-control">
                <div className="input-group">
                  <input
                    type="text"
                    data-loading={loading}
                    disabled={loading}
                    ref={inputElement}
                    maxLength={128}
                    onKeyDown={(e) => {}}
                    onInput={() => {
                      setHasInput(inputElement.current.value.length > 0)
                    }}
                    placeholder="Ask GPT-3 a question..."
                    className="input input-bordered w-full "
                  />

                  <input
                    type="number"
                    data-loading={loading}
                    disabled={loading}
                    ref={tempElement}
                    maxLength={128}
                    min={0.1}
                    max={1}
                    placeholder="0.6"
                    className="input input-bordered w-25"
                  />
                  <input
                    type="number"
                    data-loading={loading}
                    disabled={loading}
                    ref={nElement}
                    maxLength={2}
                    max={6}
                    min={1}
                    placeholder="2"
                    className="input input-bordered w-25"
                  />
                  <button
                    data-loading={loading}
                    type='submit'
                    disabled={loading || !hasInput}
                    onClick={async () => {
                      setPercentage(0)
                      if (hasInput) {
                        setLoading(true)
                        setGptResult(null)
                        setGptError(null)
                        setPercentage(50)

                        if (abortRef.current !== null) abortRef.current.abort()
                        abortRef.current = new AbortController()
                        const result = await fetchPrompt(
                          inputElement.current.value,
                          abortRef.current,
                          {
                            n: nElement?.current.value || 1,
                            temp: nElement?.current.value || 0.6
                          }
                        )
                          .catch((error) => {
                            setGptError(error)
                            setLoading(false)
                          })
                          .finally(() => {
                            abortRef.current = null
                          })
                        setPercentage(100)
                        setGptResult(result)
                        setLoading(false)
                      }
                    }}
                    className="btn bg-success text-black w-20 hover:bg-black hover:text-yellow-500"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
            {gptResult !== null
              ? (
              <div className="flex flex-col gap-2 mt-4">
                {gptResult?.choices?.map((choice, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row lg:flex-row gap-2 w-full"
                    >
                      <div className="w-full">
                        <p className="text-2xl bg-warning text-white p-2">
                          <span className="badge mb-2">{index + 1}</span>
                        </p>
                        <div className="max-h-[14rem] overflow-y-scroll border-2 mb-2">
                          <div className="p-2 bg-black">
                            <Editor
                              className="w-full overflow-scroll"
                              onValueChange={(code) => {}}
                              value={choice.text}
                              highlight={(code) =>
                                highlight(code, languages.html)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-25">
                        <button
                          className="btn btn-success w-full"
                          onClick={() => {
                            onSetHTML(choice.text)
                          }}
                        >
                          Use
                        </button>
                        <button className="btn btn-dark w-full mt-2">
                          Preview
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
                )
              : (
              <></>
                )}
            <div className="btn-group w-full mt-2">
              <button
                className="btn btn-error"
                onClick={() => {
                  if (onHide) onHide()
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ChatGPTModal.propTypes = {
  onSetHTML: PropTypes.func,
  savedData: PropTypes.any,
  hidden: PropTypes.bool,
  onHide: PropTypes.func
}

export default ChatGPTModal

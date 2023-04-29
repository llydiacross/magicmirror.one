import { ethers } from 'ethers'
import { SiweMessage } from 'siwe'
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

const domain = window.location.host

async function createSiweMessage (address: any, statement: string): Promise<string> {
  const response = await fetch('http://localhost:9090/wallet/nonce', {
    credentials: 'include'
  })
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: 1,
    nonce: await response.text()
  })

  return message.prepareMessage()
}

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const { state, dispatch } = useAuthContext()

  const login = async wallet => {
    setIsLoading(true)

    const message = await createSiweMessage(
      await state.walletAddress,
      'Sign in with Ethereum to the app.'
    )
    const signature = await signer.signMessage(message)

    const response = await fetch('http://localhost:9090/wallet/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, signature }),
      credentials: 'include'
    })

    console.log(response)

    if (!response.ok) {
      setIsLoading(false)
      setError(response.body)
    }

    if (response.status === 200) {
      dispatch({ type: 'LOGIN', payload: response })
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}

import { createContext, useReducer, useEffect } from 'react'

export interface AuthContextType {
  sessionId: string | null
  verified: boolean
  loaded: boolean
  walletError: Error
};

export const AuthContext = createContext({
  walletAddress: null,
  sessionId: null,
  verified: false,
  loaded: false,
  walletError: null,
  state: null,
  dispatch: null
})

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return { wallet: action.payload }
    }
    case 'LOGOUT': {
      return { wallet: null }
    }
    default: {
      // If there's no changes, return original state.
      return state
    }
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    walletAddress: null
  })

  useEffect(() => {
    const user = 
      document
        .cookie
        .replace(
          /(?:(?:^|.*;\s*)siwe-quickstart\s*=\s*([^;]*).*$)|^.*$/, '$1')

    if (user) {
      dispatch({ type: 'LOGIN', payload: user })
    }
  }, [])

  console.log('AuthState: ', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

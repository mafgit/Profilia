import { createContext } from 'react'

export const AuthContext = createContext()
export const initState = {
  authenticated: false,
  user: {},
}
export const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        authenticated: true,
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        authenticated: false,
        user: {},
      }
    default:
      return state
  }
}

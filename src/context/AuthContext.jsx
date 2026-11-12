import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/mockApi'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)
export const homePath = (role) => (role === 'professor' ? '/professor' : '/student')

export function AuthProvider({ children }) {
  const toast = useToast()
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // restore the session from the stored token
  useEffect(() => {
    if (!api.hasToken()) {
      setReady(true)
      return
    }
    api
      .me()
      .then(setUser)
      .catch(() => api.logout())
      .finally(() => setReady(true))
  }, [])

  // the api fires this when a request finds the token missing or expired
  useEffect(() => {
    function onExpired() {
      api.logout()
      setUser(null)
      toast.error('Your session expired. Please sign in again.')
    }
    window.addEventListener('session-expired', onExpired)
    return () => window.removeEventListener('session-expired', onExpired)
  }, [toast])

  async function signIn(credentials) {
    const res = await api.login(credentials)
    setUser(res.user)
    return res.user
  }

  async function signUp(details) {
    const res = await api.register(details)
    setUser(res.user)
    return res.user
  }

  function signOut() {
    api.logout()
    setUser(null)
    toast.success('You have been logged out.')
  }

  return <AuthContext.Provider value={{ user, ready, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

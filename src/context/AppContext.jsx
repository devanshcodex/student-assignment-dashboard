import { createContext, useContext, useEffect, useState } from 'react'
import { USERS, seedAssignments, seedSubmissions } from '../data/seed'

const KEY = 'assignment-desk:v1'
const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

const freshData = () => ({
  assignments: seedAssignments(),
  submissions: seedSubmissions(),
  userId: null,
  dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
})

export function AppProvider({ children }) {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [data, setData] = useState(freshData)

  // Load from localStorage (short delay simulates a mock API call)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(KEY)
        if (raw) setData(JSON.parse(raw))
        setStatus('ready')
      } catch {
        setStatus('error')
      }
    }, 500)
    return () => clearTimeout(t)
  }, [])

  // Persist on every change
  useEffect(() => {
    if (status === 'ready') localStorage.setItem(KEY, JSON.stringify(data))
  }, [data, status])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', data.dark)
  }, [data.dark])

  const patch = (fn) => setData((d) => ({ ...d, ...fn(d) }))
  const user = USERS.find((u) => u.id === data.userId) || null

  const value = {
    status,
    user,
    users: USERS,
    students: USERS.filter((u) => u.role === 'student'),
    assignments: data.assignments,
    submissions: data.submissions,
    dark: data.dark,
    login: (userId) => patch(() => ({ userId })),
    logout: () => patch(() => ({ userId: null })),
    toggleDark: () => patch((d) => ({ dark: !d.dark })),
    saveAssignment: (a) =>
      patch((d) => ({
        assignments: d.assignments.some((x) => x.id === a.id)
          ? d.assignments.map((x) => (x.id === a.id ? a : x))
          : [...d.assignments, a],
      })),
    deleteAssignment: (id) =>
      patch((d) => ({
        assignments: d.assignments.filter((x) => x.id !== id),
        submissions: Object.fromEntries(Object.entries(d.submissions).filter(([k]) => !k.startsWith(id + ':'))),
      })),
    markSubmitted: (assignmentId) =>
      patch((d) => ({ submissions: { ...d.submissions, [`${assignmentId}:${d.userId}`]: true } })),
    reset: () => {
      localStorage.removeItem(KEY)
      setData(freshData())
      setStatus('ready')
    },
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

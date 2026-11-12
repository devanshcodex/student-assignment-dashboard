import { useState } from 'react'

const KEY = 'ard.theme'

const stored = () =>
  localStorage.getItem(KEY) ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export const applyTheme = () => document.documentElement.classList.toggle('dark', stored() === 'dark')

export default function useTheme() {
  const [dark, setDark] = useState(() => stored() === 'dark')

  function toggle() {
    const next = !dark
    setDark(next)
    localStorage.setItem(KEY, next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  return [dark, toggle]
}

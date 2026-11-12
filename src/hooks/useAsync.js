import { useCallback, useEffect, useState } from 'react'

// Runs an async function on mount (and whenever deps change). `reload` keeps the old data on screen.
export default function useAsync(fn, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true })

  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    return fn().then(
      (data) => setState({ data, error: null, loading: false }),
      (error) => setState({ data: null, error, loading: false })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
  }, [run])

  return { ...state, reload: run }
}

import { useEffect, useState } from 'react'
// Runs an async fn whenever deps change; exposes { data, loading, error, reload }.
export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fn().then((data) => active && setState({ data, loading: false, error: null }))
        .catch((error) => active && setState({ data: null, loading: false, error }))
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])
  return { ...state, reload: () => setTick((t) => t + 1) }
}

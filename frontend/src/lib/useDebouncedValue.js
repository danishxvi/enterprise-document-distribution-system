import { useEffect, useState } from 'react'

// Returns `value` only after it has stopped changing for `delay` ms. Used on
// the search box so typing a subject fires one request, not one per key.
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

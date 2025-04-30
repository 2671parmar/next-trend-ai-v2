import { useEffect } from 'react'
import posthog from 'posthog-js'

export function PostHogProvider({ children }) {
  useEffect(() => {
    // Initialize PostHog
    posthog.init('phc_oS8QBtUk1mBmU0j6diffSSFTXK5n6BCnPQZfKyHEP6D', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })

    // Cleanup on unmount
    return () => {
      posthog.shutdown()
    }
  }, [])

  return children
} 
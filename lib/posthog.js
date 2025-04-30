import posthog from 'posthog-js'

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined'

// Initialize PostHog only in the browser
if (isBrowser) {
  posthog.init('phc_oS8QBtUk1mBmU0j6diffSSFTXK5n6BCnPQZfKyHEP6D', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}

export default posthog 
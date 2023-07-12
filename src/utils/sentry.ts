let SentryInstance:
	| {
			captureMessage: (message: string) => void
	  }
	| undefined

if (SENTRY_DSN !== undefined) {
	console.debug(`[Sentry]`, `enabled`)
	import('@sentry/browser')
		.then((Sentry) => {
			Sentry.init({
				dsn: SENTRY_DSN,
				integrations: [
					new Sentry.BrowserTracing({
						tracePropagationTargets: [new RegExp(`^${DOMAIN_NAME}`)],
					}),
					new Sentry.Replay(),
				],
				tracesSampleRate: 0.1,
				replaysSessionSampleRate: 0.1,
				replaysOnErrorSampleRate: 1.0,
			})
			Sentry.setContext('app', {
				version: VERSION,
			})
			SentryInstance = Sentry
		})
		.catch((err) => {
			console.error(`[Sentry]`, `Failed to load @sentry/browser`)
			console.error(`[Sentry]`, err)
		})
} else {
	console.debug(`[Sentry]`, `disabled`)
}

export const captureMessage = (message: string): void => {
	console.debug(`[Sentry]`, 'captureMessage', message)
	SentryInstance?.captureMessage(message)
}

import { formatDistanceToNow } from 'date-fns'
import type { VNode } from 'preact'
import { hydrate } from 'preact'
import type { PageContextClient } from 'vike/types'
import '../src/utils/sentry.js'
import '../src/base.css'

export type Page = (pageProps: Record<string, any>) => VNode<any>

export const onRenderClient = (pageContext: PageContextClient) => {
	const Page = pageContext.Page as Page
	const pageProps = pageContext.data as Record<string, any>
	const pageViewElement = document.getElementById('page-view')
	if (pageViewElement === null)
		throw new Error(`Could not find page-view element!`)

	console.debug('version', VERSION)
	console.debug(
		'build time',
		BUILD_TIME,
		formatDistanceToNow(new Date(BUILD_TIME), {
			addSuffix: true,
		}),
	)
	console.debug('Registry Endpoint', REGISTRY_ENDPOINT)

	hydrate(<Page {...pageProps} />, pageViewElement)
}

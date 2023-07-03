import { formatDistanceToNow } from 'date-fns'
import type { VNode } from 'preact'
import { hydrate } from 'preact'
import type { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'
import '../src/utils/sentry.js'

type Page = (pageProps: PageProps) => VNode<any>
type PageProps = Record<string, any>

export type PageContextCustom = {
	Page: Page
	pageProps?: PageProps
	urlPathname: string
	exports: {
		documentProps?: {
			title?: string
			description?: string
		}
	}
}

type PageContextClient = PageContextBuiltInClientWithClientRouting<Page> &
	PageContextCustom

export const render = (pageContext: PageContextClient) => {
	const { Page, pageProps } = pageContext
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

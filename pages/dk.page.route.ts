import type { PageContextBuiltIn } from 'vite-plugin-ssr'

// export default '/dk/@model'

// TODO: remove service with .html when protection is removed
// This is needed for CloudFront and a protected S3 bucket
export default (
	pageContext: PageContextBuiltIn,
): false | { routeParams: Record<string, string> } => {
	if (!pageContext.urlPathname.startsWith('/dk/')) return false

	return {
		routeParams: {
			model: pageContext.urlPathname.split('/')[2]?.replace('.html', '') ?? '',
		},
	}
}

import type { PageContextBuiltIn } from 'vite-plugin-ssr'

// export default '/troubleshooting.html'

// TODO: remove service with .html when protection is removed
// This is needed for CloudFront and a protected S3 bucket
export default (pageContext: PageContextBuiltIn): boolean => {
	if (!pageContext.urlPathname.startsWith('/troubleshooting')) return false
	return true
}

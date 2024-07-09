export const encloseWithSlash = (s: string): string => {
	if (s.length === 0) return '/'
	return `/${s.replace(/^\/+/, '').replace(/\/$/, '')}/`
}

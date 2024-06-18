export const niceLink = (urlString: string): string => {
	const url = new URL(urlString)
	return `${url.host}${url.pathname}`
}

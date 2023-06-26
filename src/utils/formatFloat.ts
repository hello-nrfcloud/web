export const formatFloat = (f: number): string =>
	f.toFixed(2).replace(/\.0+$/, '')

export enum LocationSource {
	MCELL = 'MCELL',
	SCELL = 'SCELL',
	WIFI = 'WIFI',
	GNSS = 'GNSS',
	other = 'other',
}

const sources = Object.values(LocationSource) as string[]

export const toLocationSource = (source: string): LocationSource =>
	sources.includes(source) ? (source as LocationSource) : LocationSource.other

// Uses nrfcloud.com wording
export const LocationSourceLabels = new Map<string, string>([
	[LocationSource.WIFI, 'Wi-Fi'],
	[LocationSource.MCELL, 'Multi-cell'],
	[LocationSource.SCELL, 'Single-cell'],
	[LocationSource.GNSS, 'GNSS'],
])

// Source: https://coolors.co/palette/22577a-38a3a5-57cc99-80ed99-c7f9cc
export const locationSourceColors = new Map<string, string>([
	[LocationSource.GNSS, '#C7F9CC'],
	[LocationSource.WIFI, '#80ed99'],
	[LocationSource.MCELL, '#57cc99'],
	[LocationSource.SCELL, '#38a3a5'],
])

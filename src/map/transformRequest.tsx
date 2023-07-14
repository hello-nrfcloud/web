import type { RequestTransformFunction } from 'maplibre-gl'

export const transformRequest =
	(apiKey: string, region: string): RequestTransformFunction =>
	(url: string, resourceType?: string) => {
		if (resourceType === 'Style' && !url.includes('://')) {
			url = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`
		} else if (resourceType === 'Glyphs' && !url.includes('://')) {
			url = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${url}`
		}

		if (url.includes('amazonaws.com')) {
			return {
				url: `${url}?key=${apiKey}`,
			}
		}

		return { url }
	}

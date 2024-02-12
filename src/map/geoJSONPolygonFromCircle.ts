import type { GeoJSONSourceSpecification } from 'maplibre-gl'

export const getPolygonCoordinatesForCircle = (
	center: [lng: number, lat: number],
	radiusMeters: number,
	corners = 6,
	rotation = 0,
): [x: number, y: number][] => {
	const coords = {
		latitude: center[1],
		longitude: center[0],
	}

	const km = radiusMeters / 1000

	const ret: [x: number, y: number][] = []
	const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180))
	const distanceY = km / 110.574

	let theta, x, y
	for (let i = 0; i < corners; i++) {
		theta = (i / corners) * (2 * Math.PI) + rotation
		x = distanceX * Math.cos(theta)
		y = distanceY * Math.sin(theta)

		ret.push([coords.longitude + x, coords.latitude + y])
	}
	ret.push(ret[0] as [number, number])

	return ret
}

/**
 * GeoJSON has no support for circles, so they have to be expressed as polygons.
 */
export const geoJSONPolygonFromCircle = (
	center: [lng: number, lat: number],
	radiusMeters: number,
	corners = 6,
	rotation = 0,
): GeoJSONSourceSpecification => ({
	type: 'geojson',
	data: {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Polygon',
					coordinates: [
						getPolygonCoordinatesForCircle(
							center,
							radiusMeters,
							corners,
							rotation,
						),
					],
				},
				properties: {},
			},
		],
	},
})

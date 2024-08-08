import { getPolygonCoordinatesForCircle } from '#map/geoJSONPolygonFromCircle.js'
import type { GeoLocation } from '#proto/lwm2m.js'
import maplibregl from 'maplibre-gl'

export const centerMapOnLocation = (
	map: maplibregl.Map,
	location: GeoLocation,
): void => {
	const { lat, lng, acc } = location
	if (acc === undefined) {
		// Just center
		map.flyTo({
			center: [lng, lat],
			zoom: map.getZoom(),
		})
		return
	}
	const coordinates = getPolygonCoordinatesForCircle(
		[lng, lat],
		acc,
		6,
		Math.PI / 2,
	)
	const bounds = coordinates.reduce(
		(bounds, coord) => {
			return bounds.extend(coord)
		},
		new maplibregl.LngLatBounds(coordinates[0], coordinates[0]),
	)
	map.fitBounds(bounds, {
		padding: 20,
	})
}

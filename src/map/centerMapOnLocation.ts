import type { GeoLocation } from '#proto/lwm2m.js'
import type maplibregl from 'maplibre-gl'

export const centerMapOnLocation = (
	map: maplibregl.Map,
	location: GeoLocation,
): void => {
	const { lat, lng } = location
	map.flyTo({
		center: [lng, lat],
		zoom: map.getZoom(),
	})
}

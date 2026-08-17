import type { GeoLocation } from '#proto/lwm2m.ts'
import type { Map } from 'maplibre-gl'

export const centerMapOnLocation = (map: Map, location: GeoLocation): void => {
	const { lat, lng } = location
	map.flyTo({
		center: [lng, lat],
		zoom: map.getZoom(),
	})
}

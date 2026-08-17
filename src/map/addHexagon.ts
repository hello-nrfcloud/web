import { geoJSONPolygonFromCircle } from '#map/geoJSONPolygonFromCircle.ts'
import type { GeoLocation } from '#proto/lwm2m.ts'
import type { Map } from 'maplibre-gl'

export const addHexagon = (
	map: Map,
	{ lng, lat, src, acc }: GeoLocation & { acc: number },
	color: string,
	font: string,
): {
	layerIds: string[]
	sourceIds: string[]
} => {
	const locationAreaSourceId = `${src}-location-area-source`
	const locationAreaLayerId = `${src}-location-area-layer`
	const locationAreaLabelId = `${src}-location-area-label`
	const sourceIds = []
	const layerIds = []
	// Data for Hexagon
	map.addSource(
		locationAreaSourceId,
		geoJSONPolygonFromCircle([lng, lat], acc, 6, Math.PI / 2),
	)
	sourceIds.push(locationAreaSourceId)
	// Render Hexagon
	map.addLayer({
		id: locationAreaLayerId,
		type: 'line',
		source: locationAreaSourceId,
		layout: {},
		paint: {
			'line-color': color,
			'line-opacity': 1,
			'line-width': 2,
		},
	})
	layerIds.push(locationAreaLayerId)
	// Render label on Hexagon
	map.addLayer({
		id: locationAreaLabelId,
		type: 'symbol',
		source: locationAreaSourceId,
		layout: {
			'symbol-placement': 'line',
			'text-field': `${Math.round(acc)} m`,
			'text-font': [font],
			'text-offset': [0, -1],
			'text-size': 14,
		},
		paint: {
			'text-color': color,
		},
	})
	layerIds.push(locationAreaLabelId)

	return {
		layerIds,
		sourceIds,
	}
}

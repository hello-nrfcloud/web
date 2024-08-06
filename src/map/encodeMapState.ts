import { MapStyle } from '#context/Map.js'
import type maplibregl from 'maplibre-gl'

export const encodeMapState = (
	map: Pick<maplibregl.Map, 'getCenter' | 'getZoom'>,
	style: MapStyle,
): string => {
	const { lat, lng } = map.getCenter()
	return `map:${lat},${lng},${map.getZoom()},${style}`
}

export const decodeMapState = (
	hash: string,
): { lat: number; lng: number; zoom: number; style: MapStyle } | undefined => {
	const [lat, lng, zoom, style] = hash.slice(4).split(',')
	if (
		lat === undefined ||
		lng === undefined ||
		zoom === undefined ||
		style === undefined ||
		!isMapStyle(style)
	)
		return undefined
	return {
		lat: Number(lat),
		lng: Number(lng),
		zoom: Number(zoom),
		style,
	}
}

const isMapStyle = (style: string): style is MapStyle =>
	[MapStyle.DARK, MapStyle.LIGHT].includes(style as MapStyle)

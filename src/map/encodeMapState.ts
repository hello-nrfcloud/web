import type maplibregl from 'maplibre-gl'

export const encodeMapState = (
	map: Pick<maplibregl.Map, 'getCenter' | 'getZoom'>,
): string => {
	const { lat, lng } = map.getCenter()
	return `map:${lat},${lng},${map.getZoom()}`
}

export const decodeMapState = (
	hash: string,
): { lat: number; lng: number; zoom: number } | undefined => {
	const [lat, lng, zoom] = hash.slice(4).split(',').map(Number)
	if (lat === undefined || lng === undefined || zoom === undefined)
		return undefined
	return { lat, lng, zoom }
}

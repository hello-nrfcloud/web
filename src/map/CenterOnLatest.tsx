import { useDeviceLocation } from '#context/DeviceLocation.js'
import { useMapState } from '#context/MapState.js'
import { centerMapOnLocation } from '#map/centerMapOnLocation.js'
import { byTs } from '#utils/byTs.js'
import type maplibregl from 'maplibre-gl'
import { useEffect } from 'preact/hooks'

/**
 * Center the map on the latest location on startup
 */
export const CenterOnLatest = ({ map }: { map: maplibregl.Map }) => {
	const { locations } = useDeviceLocation()
	const mapState = useMapState()

	// Center on latest location
	useEffect(() => {
		if (mapState.state?.center !== undefined) return
		const latest = Object.values(locations).sort(byTs)[0]
		if (latest === undefined) return
		console.debug(`[Map]`, `centering on latest location`, latest)
		centerMapOnLocation(map, latest)
	}, [locations, mapState])

	return null
}

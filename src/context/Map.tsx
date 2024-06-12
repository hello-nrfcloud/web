import type maplibregl from 'maplibre-gl'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useState } from 'preact/hooks'

export const MapContext = createContext<{
	locked: boolean
	unlock: () => void
	lock: () => void
	toggleLock: () => void
	map?: maplibregl.Map
	setMap: (map: maplibregl.Map) => void
	clearMap: () => void
}>({
	locked: true,
	unlock: () => undefined,
	lock: () => undefined,
	toggleLock: () => undefined,
	setMap: () => undefined,
	clearMap: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [locked, setLocked] = useState<boolean>(true)
	const [map, setMap] = useState<maplibregl.Map | undefined>(undefined)

	return (
		<MapContext.Provider
			value={{
				locked,
				unlock: () => setLocked(false),
				lock: () => setLocked(true),
				toggleLock: () => setLocked((l) => !l),
				map,
				setMap,
				clearMap: () => {
					map?.remove()
					setMap(undefined)
				},
			}}
		>
			{children}
		</MapContext.Provider>
	)
}

export const Consumer = MapContext.Consumer

export const useMap = () => useContext(MapContext)

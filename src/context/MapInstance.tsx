import { createContext, type ComponentChildren } from 'preact'
import { useContext, useState } from 'preact/hooks'

export const MapInstanceContext = createContext<{
	map?: maplibregl.Map
	setMap: (map?: maplibregl.Map) => void
}>({
	setMap: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [map, setMap] = useState<maplibregl.Map | undefined>()

	return (
		<MapInstanceContext.Provider
			value={{
				map,
				setMap,
			}}
		>
			{children}
		</MapInstanceContext.Provider>
	)
}

export const Consumer = MapInstanceContext.Consumer

export const useMapInstance = () => useContext(MapInstanceContext)

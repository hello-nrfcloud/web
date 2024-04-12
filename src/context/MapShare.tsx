import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice } from '#context/Device.js'
import { useParameters } from '#context/Parameters.js'
import { validatingFetch } from '#utils/validatingFetch.js'
import { PublicDevice } from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'

export const MapShareContext = createContext<{
	shared?: Static<typeof PublicDevice>
	refresh: () => void
}>({ refresh: () => undefined })
const fetchDevice = validatingFetch(PublicDevice)

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { device } = useDevice()
	const { onParameters } = useParameters()

	const [shared, setShared] = useState<Static<typeof PublicDevice>>()

	const fetchPublicDevice = (deviceId: string) => {
		onParameters(({ sharingStatusAPIURL }) => {
			fetchDevice(new URL(`./${deviceId}`, sharingStatusAPIURL)).ok(
				(publicDevice) => {
					console.log(`[MapShare]`, publicDevice)
					setShared(publicDevice)
				},
			)
		})
	}

	useEffect(() => {
		if (device === undefined) return
		fetchPublicDevice(device.id)
	}, [device])

	return (
		<MapShareContext.Provider
			value={{
				shared,
				refresh: () => {
					if (device !== undefined) fetchPublicDevice(device.id)
				},
			}}
		>
			{children}
		</MapShareContext.Provider>
	)
}

export const Consumer = MapShareContext.Consumer

export const useMapShare = () => useContext(MapShareContext)

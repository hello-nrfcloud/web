import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice } from '#context/Device.js'
import { useParameters } from '#context/Parameters.js'
import { validatingFetch } from '#utils/validatingFetch.js'
import { Devices, PublicDevice } from '@hello.nrfcloud.com/proto/hello/map'
import type { Static } from '@sinclair/typebox'

export const MapShareContext = createContext<{
	shared?: Static<typeof PublicDevice>
}>({})
const fetchDevices = validatingFetch(Devices)

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { device } = useDevice()
	const { onParameters } = useParameters()

	const [shared, setShared] = useState<Static<typeof PublicDevice>>()

	useEffect(() => {
		if (device === undefined) return
		console.log(device)
		onParameters(({ devicesAPIURL }) => {
			fetchDevices(
				new URL(
					`${devicesAPIURL}?${new URLSearchParams({ deviceID: device.id })}`,
				),
			).ok((publicDevices) => {
				console.log(`[MapShare]`, publicDevices)
				if (publicDevices.devices.length > 0) {
					setShared(publicDevices.devices[0])
				}
			})
		})
	}, [device])

	return (
		<MapShareContext.Provider value={{ shared }}>
			{children}
		</MapShareContext.Provider>
	)
}

export const Consumer = MapShareContext.Consumer

export const useMapShare = () => useContext(MapShareContext)

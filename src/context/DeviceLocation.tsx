import { Context } from '@hello.nrfcloud.com/proto/hello'
import {
	Location,
	LocationSource,
} from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from './Device.js'
import type { IncomingMessageType } from '#proto/proto.js'

export type Locations = Partial<
	Record<keyof typeof LocationSource, Static<typeof Location>>
>

export const DeviceLocationContext = createContext<{
	locations: Locations
}>({
	locations: {},
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener, device } = useDevice()

	const [locations, setLocations] = useState<Locations>({})

	useEffect(() => {
		if (device === undefined) return
		const listener: MessageListenerFn = (message) => {
			if (isLocation(message, device.model.name))
				setLocations((l) => ({ ...l, [message.src]: message }))
		}
		const { remove } = addMessageListener(listener)

		return () => {
			remove()
		}
	}, [device])

	return (
		<DeviceLocationContext.Provider
			value={{
				locations,
			}}
		>
			{children}
		</DeviceLocationContext.Provider>
	)
}

export const Consumer = DeviceLocationContext.Consumer

export const useDeviceLocation = () => useContext(DeviceLocationContext)

const isLocation = (
	message: IncomingMessageType,
	model: string,
): message is Static<typeof Location> =>
	message['@context'] ===
	Context.model(model).transformed('location').toString()

import {
	Context,
	HelloMessage,
	Location,
} from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from './Device.js'

export const DeviceLocationContext = createContext<{
	location?: Static<typeof Location>
}>({})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener, device } = useDevice()

	const [location, setLocation] = useState<Static<typeof Location> | undefined>(
		undefined,
	)

	useEffect(() => {
		if (device === undefined) return
		const listener: MessageListenerFn = (message) => {
			if (isLocation(message, device.type.model)) setLocation(message)
		}
		const { remove } = addMessageListener(listener)

		return () => {
			remove()
		}
	}, [device])

	return (
		<DeviceLocationContext.Provider
			value={{
				location,
			}}
		>
			{children}
		</DeviceLocationContext.Provider>
	)
}

export const Consumer = DeviceLocationContext.Consumer

export const useDeviceLocation = () => useContext(DeviceLocationContext)

const isLocation = (
	message: Static<typeof HelloMessage>,
	model: string,
): message is Static<typeof Location> =>
	message['@context'] ===
	Context.model(model).transformed('location').toString()

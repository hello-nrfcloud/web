import { Context } from '@hello.nrfcloud.com/proto/hello'
import {
	Thingy91WithSolarShieldMessage,
	Reported,
} from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from './Device.js'

export const DeviceStateContext = createContext<{
	state?: Static<typeof Reported>
}>({})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener, device } = useDevice()

	const [state, setState] = useState<Static<typeof Reported> | undefined>(
		undefined,
	)

	useEffect(() => {
		if (device === undefined) return
		const listener: MessageListenerFn = (message) => {
			if (isState(message, device.model.name)) setState(message)
		}
		const { remove } = addMessageListener(listener)

		return () => {
			remove()
		}
	}, [device])

	return (
		<DeviceStateContext.Provider
			value={{
				state,
			}}
		>
			{children}
		</DeviceStateContext.Provider>
	)
}

export const Consumer = DeviceStateContext.Consumer

export const useDeviceState = () => useContext(DeviceStateContext)

const isState = (
	message: Static<typeof Thingy91WithSolarShieldMessage>,
	model: string,
): message is Static<typeof Reported> =>
	message['@context'] ===
	Context.model(model).transformed('reported').toString()

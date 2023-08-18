import type { IncomingMessageType } from '#proto/proto.js'
import { Context } from '@hello.nrfcloud.com/proto/hello'
import {
	Configuration,
	DesiredConfiguration,
	Reported,
} from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from './Device.js'

export const DeviceStateContext = createContext<{
	state?: Static<typeof Reported>
	desiredConfig: Static<typeof Configuration>
	updateConfig: (update: Static<typeof Configuration>) => void
}>({
	desiredConfig: {},
	updateConfig: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener, device } = useDevice()
	const [state, setState] = useState<Static<typeof Reported> | undefined>(
		undefined,
	)
	const [desiredConfig, setDesiredConfig] = useState<
		Static<typeof Configuration>
	>({})

	useEffect(() => {
		if (device === undefined) return
		const listener: MessageListenerFn = (message) => {
			if (isState(message, device.model.name)) setState(message)
			if (isDesiredConfiguration(message, device.model.name))
				setDesiredConfig(message.config ?? {})
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
				desiredConfig,
				updateConfig: (update) => {
					setDesiredConfig((cfg) => ({ ...cfg, ...update }))
				},
			}}
		>
			{children}
		</DeviceStateContext.Provider>
	)
}

export const Consumer = DeviceStateContext.Consumer

export const useDeviceState = () => useContext(DeviceStateContext)

const isState = (
	message: IncomingMessageType,
	model: string,
): message is Static<typeof Reported> =>
	message['@context'] ===
	Context.model(model).transformed('reported').toString()

const isDesiredConfiguration = (
	message: IncomingMessageType,
	model: string,
): message is Static<typeof DesiredConfiguration> =>
	message['@context'] ===
	Context.model(model).transformed('desiredConfiguration').toString()

export const gnssEnabled = (config: Static<typeof Configuration>): boolean =>
	!(config.nod ?? ['gnss']).includes('gnss')

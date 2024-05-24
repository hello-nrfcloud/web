import { Context, Shadow } from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from './Device.js'
import { isObject } from 'lodash-es'
import type { LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/lwm2m'

export const DeviceStateContext = createContext<{
	state: Array<LwM2MObjectInstance>
	desiredConfig: Array<LwM2MObjectInstance>
	updateConfig: (update: Array<LwM2MObjectInstance>) => void
}>({
	state: [],
	desiredConfig: [],
	updateConfig: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener, device } = useDevice()
	const [state] = useState<Array<LwM2MObjectInstance>>([])
	const [desiredConfig, setDesiredConfig] = useState<
		Array<LwM2MObjectInstance>
	>([])

	useEffect(() => {
		if (device === undefined) return
		const listener: MessageListenerFn = (message) => {
			if (isShadow(message)) {
				// FIXME: parse shadow
			}
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

const isShadow = (message: unknown): message is Static<typeof Shadow> =>
	isObject(message) &&
	'@context' in message &&
	message['@context'] === Context.shadow

// FIXME: Implement
export const gnssEnabled = (): boolean => false

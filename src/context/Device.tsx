import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { DK, DKs } from '../DKs'

export type Device = {
	imei: string
	pin: string
	hasLocation: boolean
	type: DK
}

export const DeviceContext = createContext<{
	type?: DK | undefined
	device?: Device | undefined
	fromType: (type: keyof typeof DKs) => void
	fromPIN: (pin: string) => void
	clear: () => void
}>({
	fromType: () => undefined,
	fromPIN: () => undefined,
	clear: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [type, setType] = useState<keyof typeof DKs | undefined>(undefined)

	console.debug(`[Device]`, device)

	useEffect(() => {
		if (device?.imei === undefined) return
		const t = setTimeout(() => {
			setDevice((d) => ({
				...(d as Device),
				hasLocation: true,
			}))
		}, 10000)
		return () => clearTimeout(t)
	}, [device])

	return (
		<DeviceContext.Provider
			value={{
				fromPIN: (pin) => {
					setDevice({
						hasLocation: false,
						pin: pin,
						imei: '351234567890123',
						type: DKs['PCA10090'] as DK,
					})
					setType('PCA10090')
				},
				clear: () => {
					setDevice(undefined)
					setType(undefined)
				},
				fromType: (type) => {
					if (DKs[type] === undefined) return
					setType(type)
				},
				device,
				type: type === undefined ? undefined : DKs[type],
			}}
		>
			{children}
		</DeviceContext.Provider>
	)
}

export const Consumer = DeviceContext.Consumer

export const useDevice = () => useContext(DeviceContext)

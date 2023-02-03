import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type DK = {
	model: string
	title: string
	html: string
	tags: string[]
	learnMoreLink: string
}

export type Device = {
	imei: string
	code: string
	hasLocation: boolean
	type: DK
}

export const DeviceContext = createContext<{
	type?: DK | undefined
	device?: Device | undefined
	fromType: (type: string) => void
	fromCode: (code: string) => void
	clear: () => void
	DKs: Record<string, DK>
}>({
	fromType: () => undefined,
	fromCode: () => undefined,
	clear: () => undefined,
	DKs: {},
})

export const Provider = ({
	children,
	DKs,
}: {
	children: ComponentChildren
	DKs: Record<string, DK>
}) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [type, setType] = useState<string | undefined>(undefined)

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
				fromCode: (code) => {
					setDevice({
						hasLocation: false,
						code,
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
				DKs,
			}}
		>
			{children}
		</DeviceContext.Provider>
	)
}

export const Consumer = DeviceContext.Consumer

export const useDevice = () => useContext(DeviceContext)

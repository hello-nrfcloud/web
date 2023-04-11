import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useCode } from './Code'

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
	fromCode: (code: string) => void
	DKs: Record<string, DK>
}>({
	fromCode: () => undefined,
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
	const { code } = useCode()

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

	useEffect(() => {
		if (code === null) return
		setDevice({
			hasLocation: false,
			code,
			imei: '351234567890123',
			type: DKs['PCA10090'] as DK,
		})
		setType('PCA10090')
	}, [code])

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

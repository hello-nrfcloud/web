import { createContext, type ComponentChildren } from 'preact'
import { useContext } from 'preact/hooks'

export type Model = {
	name: string
	title: string
	tagline: string
	abstract: string
	html: string
	links: {
		learnMore: string
		documentation: string
	}
	firmware: {
		version: string
		link: string
	}
	mfw: {
		version: string
		link: string
	}
	video?: {
		youtube?: {
			id: string
			title: string
		}
	}
	// amount of data sent to cloud for every update
	bytesPerUpdate: number
	// Do not show in the list of available models
	hidden?: true
	includedSIM?: Array<IncludedSIM>
	modeUsagePerDayMB: {
		[Mode.realTime]: number //e.g. 3
		[Mode.interactive]: number //e.g. 1.5
		[Mode.lowPower]: number //e.g. 0.05
	}
	defaultConfiguration: Configuration
}

export type Configuration = {
	mode: Mode
	gnssEnabled: boolean
}

export enum Mode {
	realTime = 'realTime',
	interactive = 'interactive',
	lowPower = 'lowPower',
}

export const ModeId = new Map<Mode, number>([
	[Mode.realTime, 0],
	[Mode.interactive, 1],
	[Mode.lowPower, 2],
])

export const ModeUpdateIntervalSeconds = new Map<Mode, number>([
	[Mode.realTime, 10],
	[Mode.interactive, 120],
	[Mode.lowPower, 600],
])

export const DefaultConfiguration: Configuration = {
	mode: Mode.interactive,
	gnssEnabled: true,
}

export const defaultUpdateIntervalSeconds =
	ModeUpdateIntervalSeconds.get(DefaultConfiguration.mode) ?? 120

export const updateIntervalSeconds = (mode?: Mode) =>
	ModeUpdateIntervalSeconds.get(mode ?? DefaultConfiguration.mode) ??
	defaultUpdateIntervalSeconds

export enum SIMVendor {
	iBasis = 'iBasis',
	onomondo = 'onomondo',
	WirelessLogic = 'Wireless Logic',
}
type IncludedSIM = {
	vendor: SIMVendor
	// amount of free data on the shipped SIM in megabytes
	freeMb: number
}

export const ModelsContext = createContext<{
	models: Record<string, Model>
}>({
	models: {},
})

export const Provider = ({
	children,
	models,
}: {
	children: ComponentChildren
	models: Record<string, Model>
}) => {
	return (
		<ModelsContext.Provider
			value={{
				models,
			}}
		>
			{children}
		</ModelsContext.Provider>
	)
}

export const Consumer = ModelsContext.Consumer

export const useModels = () => useContext(ModelsContext)

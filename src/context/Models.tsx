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
	// Do not show in the list of available models
	hidden?: true
	includedSIM?: Array<IncludedSIM>
	defaultConfiguration: Configuration
	configurationPresets: Array<
		{
			name: string
			dataUsagePerDayMB: number
		} & Pick<Configuration, 'updateIntervalSeconds'> &
			Partial<Configuration>
	>
}

export type Configuration = {
	updateIntervalSeconds: number
	gnssEnabled: boolean
}

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

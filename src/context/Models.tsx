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
	// amount of free data on the shipped SIM in megabytes
	freeMbOnSIM: number
	// Do not show in the list of available models
	hidden?: true
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

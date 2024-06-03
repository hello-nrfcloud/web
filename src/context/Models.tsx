import type { ModelMarkdown } from '#content/models.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext } from 'preact/hooks'

export type IncludedSIM = {
	vendor: string
	companyName: string
	// amount of free data on the shipped SIM in megabytes
	freeMb: number
	html: string
}

export type Model = Omit<ModelMarkdown, 'includedSIMs'> & {
	includedSIMs: Array<IncludedSIM>
	variant?: string
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

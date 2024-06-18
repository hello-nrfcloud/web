import type { Model } from '#content/models/types.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext } from 'preact/hooks'

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

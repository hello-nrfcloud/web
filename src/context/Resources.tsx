import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'

export type Resource = {
	title: string
	descriptionHTML: string
	callToAction: {
		text: string
		link: string
	}
	tags: string[]
}

export const ResourcesContext = createContext<{
	resources: Resource[]
}>({
	resources: [],
})

export const Provider = ({
	children,
	resources,
}: {
	children: ComponentChildren
	resources: Resource[]
}) => {
	return (
		<ResourcesContext.Provider
			value={{
				resources,
			}}
		>
			{children}
		</ResourcesContext.Provider>
	)
}

export const Consumer = ResourcesContext.Consumer

export const useResources = () => useContext(ResourcesContext)

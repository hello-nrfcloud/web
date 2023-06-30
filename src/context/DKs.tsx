import { createContext, type ComponentChildren } from 'preact'
import { useContext } from 'preact/hooks'

export type DK = {
	model: string
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
}

export const DKsContext = createContext<{
	DKs: Record<string, DK>
}>({
	DKs: {},
})

export const Provider = ({
	children,
	DKs,
}: {
	children: ComponentChildren
	DKs: Record<string, DK>
}) => {
	return (
		<DKsContext.Provider
			value={{
				DKs,
			}}
		>
			{children}
		</DKsContext.Provider>
	)
}

export const Consumer = DKsContext.Consumer

export const useDKs = () => useContext(DKsContext)

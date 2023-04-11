import { createContext, type ComponentChildren } from 'preact'
import { useContext } from 'preact/hooks'

export const ParametersContext = createContext<{
	webSocketURI: Promise<URL>
}>({
	webSocketURI: Promise.resolve(new URL('https://example.com')),
})

const parametersPromise: Promise<{ webSocketURI: URL }> = fetch(
	REGISTRY_ENDPOINT,
)
	.then(async (res) => res.json())
	.then((parameters) => {
		console.debug('[Parameters]', parameters)
		const { webSocketURI } = parameters
		const parsed = {
			webSocketURI: new URL(webSocketURI),
		}
		Object.entries(parsed).forEach(([k, v]) =>
			console.debug('[Parameters]', k, v),
		)
		return parsed
	})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	return (
		<ParametersContext.Provider
			value={{
				webSocketURI: parametersPromise.then(
					({ webSocketURI }) => webSocketURI,
				),
			}}
		>
			{children}
		</ParametersContext.Provider>
	)
}

export const Consumer = ParametersContext.Consumer

export const useParameters = () => useContext(ParametersContext)

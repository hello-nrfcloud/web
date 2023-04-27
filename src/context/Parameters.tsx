import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export const ParametersContext = createContext<{
	webSocketURI?: URL
}>({})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [webSocketURI, setWebsocketURI] = useState<URL>()
	useEffect(() => {
		fetch(REGISTRY_ENDPOINT)
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
				setWebsocketURI(parsed.webSocketURI)
			})
			.catch(console.error)
	}, [REGISTRY_ENDPOINT])
	return (
		<ParametersContext.Provider
			value={{
				webSocketURI,
			}}
		>
			{children}
		</ParametersContext.Provider>
	)
}

export const Consumer = ParametersContext.Consumer

export const useParameters = () => useContext(ParametersContext)

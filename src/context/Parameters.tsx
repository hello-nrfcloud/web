import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

type Parameters = {
	webSocketURI: URL
	// Map resources
	mapName: string
	cognitoIdentityPoolId: string
	region: string
}
export const ParametersContext = createContext<Parameters>({} as Parameters)

export const Provider = ({
	children,
}: {
	children: (parameters: Parameters) => ComponentChildren
}) => {
	const [parameters, setParameters] = useState<Parameters>()

	useEffect(() => {
		fetch(REGISTRY_ENDPOINT)
			.then(async (res) => res.json())
			.then((parameters) => {
				console.debug('[Parameters]', parameters)
				const { webSocketURI, mapName, cognitoIdentityPoolId } = parameters
				const parsed = {
					webSocketURI: new URL(webSocketURI),
					mapName,
					cognitoIdentityPoolId,
					region: cognitoIdentityPoolId.split(':')[0],
				}
				setParameters(parsed)
			})
			.catch(console.error)
	}, [REGISTRY_ENDPOINT])

	if (parameters === undefined) return null
	Object.entries(parameters).forEach(([k, v]) =>
		console.debug('[Parameters]', k, v),
	)
	return (
		<ParametersContext.Provider value={parameters}>
			{children(parameters)}
		</ParametersContext.Provider>
	)
}

export const Consumer = ParametersContext.Consumer

export const useParameters = () => useContext(ParametersContext)

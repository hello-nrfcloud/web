import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

type Parameters = {
	webSocketURI: URL
	// Map resources
	mapName: string
	cognitoIdentityPoolId: string
	region: string
}
export const ParametersContext = createContext<{
	onParameters: (listener: (parameters: Parameters) => void) => void
}>({
	onParameters: () => undefined,
})

const parametersPromise: Promise<
	{ parameters: Parameters } | { error: Error }
> = (async (): Promise<{ parameters: Parameters } | { error: Error }> => {
	try {
		const res = await fetch(REGISTRY_ENDPOINT)
		if (res.status >= 400) {
			throw new Error(`Failed to fetch parameters: ${await res.text()}`)
		}
		const parameters = await res.json()
		const { webSocketURI, mapName, cognitoIdentityPoolId } = parameters
		const parsed = {
			webSocketURI: new URL(webSocketURI),
			mapName,
			cognitoIdentityPoolId,
			region: cognitoIdentityPoolId.split(':')[0],
		}
		Object.entries(parsed).forEach(([k, v]) =>
			console.debug('[Parameters]', k, v.toString()),
		)
		return { parameters: parsed }
	} catch (error) {
		console.error(`[Parameters]`, error)
		return { error: error as Error }
	}
})()

export const Provider = ({ children }: { children: ComponentChildren }) => (
	<ParametersContext.Provider
		value={{
			onParameters: (listener) => {
				parametersPromise
					.then((res) => {
						if ('parameters' in res) listener(res.parameters)
					})
					.catch((error) => console.error(`[Parameters]`, error))
			},
		}}
	>
		{children}
	</ParametersContext.Provider>
)

export const Consumer = ParametersContext.Consumer

export const useParameters = () => useContext(ParametersContext)

export const WithParameters = ({
	children,
}: {
	children: (parameters: Parameters) => preact.ComponentChild
}) => {
	const { onParameters } = useParameters()

	const [params, setParams] = useState<Parameters>()

	useEffect(() => {
		onParameters(setParams)
	}, [])

	if (params === undefined) return null
	return <>{children(params)}</>
}

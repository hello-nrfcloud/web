import { WithParameters } from '#context/Parameters.js'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import {
	fromCognitoIdentityPool,
	type CognitoIdentityCredentials,
} from '@aws-sdk/credential-provider-cognito-identity'
import type { ComponentChildren } from 'preact'
import { createContext } from 'preact'
import type { PropsWithChildren } from 'preact/compat'
import { useContext, useEffect, useState } from 'preact/hooks'

export const CognitoCredentialsContext = createContext<{
	credentials: CognitoIdentityCredentials
}>({
	credentials: undefined as unknown as CognitoIdentityCredentials,
})

export const Provider = ({
	children,
	identityPoolId,
	region,
}: {
	children: ComponentChildren
	identityPoolId: string
	region: string
}) => {
	const [credentials, setCredentials] = useState<CognitoIdentityCredentials>()

	const refreshCredentials = async () =>
		fromCognitoIdentityPool({
			identityPoolId,
			client: new CognitoIdentityClient({ region }),
		})()
			.then((credentials) => setCredentials(credentials))
			.catch(console.error)

	// Create credentials for unauthenticated users
	useEffect(() => {
		refreshCredentials().catch(console.error)
	}, [])

	// Refresh credentials
	useEffect(() => {
		if (credentials === undefined) return

		const t = setTimeout(() => {
			refreshCredentials().catch(console.error)
		}, (credentials.expiration as Date).getTime() - new Date().getTime())

		return () => {
			clearTimeout(t)
		}
	}, [credentials])

	if (credentials === undefined) return null

	return (
		<CognitoCredentialsContext.Provider
			value={{
				credentials,
			}}
		>
			{children}
		</CognitoCredentialsContext.Provider>
	)
}

export const Consumer = CognitoCredentialsContext.Consumer

export const useCognitoCredentials = () => useContext(CognitoCredentialsContext)

export const WithCognitoCredentials = ({
	children,
}: PropsWithChildren<unknown>) => (
	<WithParameters>
		{(params) => (
			<Provider
				identityPoolId={params.cognitoIdentityPoolId}
				region={params.region}
			>
				{children}
			</Provider>
		)}
	</WithParameters>
)

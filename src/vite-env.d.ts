// These constants are string-replaced compile time.
// See https://vitejs.dev/config/shared-options.html#define
declare const VERSION: string
declare const HOMEPAGE: string
declare const BUILD_TIME: string
/** URL of the configuration registry. */
declare const REGISTRY_ENDPOINT: string
/** Domain name where app is hosted. */
declare const DOMAIN_NAME: string
/** The AWS Location Services Maps provider name */
declare const MAP_NAME: string
declare const COGNITO_IDENTITY_POOL_ID: string
declare const REGION: string

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {
	readonly env: ImportMetaEnv
}

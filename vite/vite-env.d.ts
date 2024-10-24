// These constants are string-replaced compile time.

// See https://vitejs.dev/config/shared-options.html#define
declare const VERSION: string
declare const HOMEPAGE: string
declare const BUILD_TIME: string
/** URL of the configuration registry. */
declare const REGISTRY_ENDPOINT: string
/** Domain name where app is hosted. */
declare const DOMAIN_NAME: string
/** Sentry DSN, optional */
declare const SENTRY_DSN: string | undefined
/** Version of @hello.nrfcloud.com/proto-map */
declare const PROTO_MAP_VERSION: string

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {
	readonly env: ImportMetaEnv
}

import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export const CodeContext = createContext<{
	clear: () => void
	set: (fingerprint: string) => void
	fingerprint: string | null
}>({
	clear: () => undefined,
	set: () => undefined,
	fingerprint: null,
})

const storageKey = 'muninn:fingerprint'

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [fingerprint, setFingerprint] = useState<string | null>(
		localStorage.getItem(storageKey),
	)

	useEffect(() => {
		const fingerprintFromQuery = new URLSearchParams(
			document.location.search,
		).get('fingerprint')
		if (fingerprintFromQuery === null) return
		localStorage.setItem(storageKey, fingerprintFromQuery)
		document.location.href = '/'
	}, [])

	return (
		<CodeContext.Provider
			value={{
				clear: () => {
					localStorage.removeItem(storageKey)
					document.location.href = '/'
				},
				fingerprint,
				set: (fingerprint: string) => {
					localStorage.setItem(storageKey, fingerprint)
					setFingerprint(fingerprint)
				},
			}}
		>
			{children}
		</CodeContext.Provider>
	)
}

export const Consumer = CodeContext.Consumer

export const useFingerprint = () => useContext(CodeContext)

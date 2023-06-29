import { getItem, removeItem, setItem } from '#utils/localStorage.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export const FingerprintContext = createContext<{
	clear: () => void
	set: (fingerprint: string) => void
	fingerprint: string | null
}>({
	clear: () => undefined,
	set: () => undefined,
	fingerprint: null,
})

const storageKey = 'fingerprint'

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [fingerprint, setFingerprint] = useState<string | null>(
		getItem(storageKey),
	)

	useEffect(() => {
		const fingerprintFromQuery = new URLSearchParams(
			document.location.search,
		).get('fingerprint')
		if (fingerprintFromQuery === null) return
		setItem(storageKey, fingerprintFromQuery)
		document.location.assign('/recognizing-fingerprint')
	}, [])

	return (
		<FingerprintContext.Provider
			value={{
				clear: () => {
					removeItem(storageKey)
					document.location.assign(
						`/?${new URLSearchParams({
							from: 'clear-fingerprint',
						}).toString()}`,
					)
				},
				fingerprint,
				set: (fingerprint: string) => {
					setItem(storageKey, fingerprint)
					setFingerprint(fingerprint)
				},
			}}
		>
			{children}
		</FingerprintContext.Provider>
	)
}

export const Consumer = FingerprintContext.Consumer

export const useFingerprint = () => useContext(FingerprintContext)

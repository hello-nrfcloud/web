import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect } from 'preact/hooks'

export const CodeContext = createContext<{
	clear: () => void
	code: string | null
}>({
	clear: () => undefined,
	code: null,
})

const storageKey = 'nrf.guide:code'

export const Provider = ({ children }: { children: ComponentChildren }) => {
	useEffect(() => {
		const codeFromQuery = new URLSearchParams(document.location.search).get(
			'code',
		)
		if (codeFromQuery === null) return
		localStorage.setItem(storageKey, codeFromQuery)
		document.location.href = '/'
	}, [])

	return (
		<CodeContext.Provider
			value={{
				clear: () => {
					localStorage.removeItem(storageKey)
					document.location.href = '/'
				},
				code: localStorage.getItem(storageKey),
			}}
		>
			{children}
		</CodeContext.Provider>
	)
}

export const Consumer = CodeContext.Consumer

export const useCode = () => useContext(CodeContext)

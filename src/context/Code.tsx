import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export const CodeContext = createContext<{
	clear: () => void
	set: (code: string) => void
	code: string | null
}>({
	clear: () => undefined,
	set: () => undefined,
	code: null,
})

const storageKey = 'nrf.guide:code'

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [code, setCode] = useState<string | null>(
		localStorage.getItem(storageKey),
	)

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
				code,
				set: (code: string) => {
					localStorage.setItem(storageKey, code)
					setCode(code)
				},
			}}
		>
			{children}
		</CodeContext.Provider>
	)
}

export const Consumer = CodeContext.Consumer

export const useCode = () => useContext(CodeContext)

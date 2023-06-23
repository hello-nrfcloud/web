import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export const AppSettingsContext = createContext<{
	terminalVisible: boolean
	showTerminal: (visible: boolean) => void
	devModeEnabled: boolean
	enableDevMode: () => void
}>({
	terminalVisible: false,
	showTerminal: () => undefined,
	devModeEnabled: false,
	enableDevMode: () => undefined,
})

const storageKey = 'app:settings:2'

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [appSettings, setAppSettings] = useState<{
		terminalVisible: boolean
		devModeEnabled: boolean
	}>(
		JSON.parse(
			localStorage.getItem(storageKey) ??
				JSON.stringify({ terminalVisible: false, devModeEnabled: false }),
		),
	)

	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(appSettings))
	}, [appSettings])

	return (
		<AppSettingsContext.Provider
			value={{
				terminalVisible: appSettings.terminalVisible,
				devModeEnabled: appSettings.devModeEnabled,
				showTerminal: (visible) =>
					setAppSettings((settings) => ({
						...settings,
						terminalVisible: visible,
					})),
				enableDevMode: () =>
					setAppSettings((settings) => ({
						...settings,
						devModeEnabled: true,
					})),
			}}
		>
			{children}
		</AppSettingsContext.Provider>
	)
}

export const Consumer = AppSettingsContext.Consumer

export const useAppSettings = () => useContext(AppSettingsContext)

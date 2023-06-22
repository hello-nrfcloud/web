import { createContext, type ComponentChildren } from 'preact'
import { useContext, useState } from 'preact/hooks'

export const AppSettingsContext = createContext<{
	mqttTerminalVisible: boolean
	showMqttTerminal: (visible: boolean) => void
}>({
	mqttTerminalVisible: false,
	showMqttTerminal: () => undefined,
})

const storageKey = 'app:settings'

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [appSettings, setAppSettings] = useState<{
		mqttTerminalVisible: boolean
	}>(
		JSON.parse(
			localStorage.getItem(storageKey) ??
				JSON.stringify({ mqttTerminalVisible: false }),
		),
	)

	return (
		<AppSettingsContext.Provider
			value={{
				mqttTerminalVisible: appSettings.mqttTerminalVisible,
				showMqttTerminal: (visible) =>
					setAppSettings((settings) => ({
						...settings,
						mqttTerminalVisible: visible,
					})),
			}}
		>
			{children}
		</AppSettingsContext.Provider>
	)
}

export const Consumer = AppSettingsContext.Consumer

export const useAppSettings = () => useContext(AppSettingsContext)

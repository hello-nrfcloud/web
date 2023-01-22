import { ComponentChildren, createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'
import type { DKs } from '../DKs'

type Settings = {
	selectedDK?: keyof typeof DKs
}

const defaultSettings: Settings = {}

const loadDefaults = () => {
	const stored = localStorage.getItem('settings')
	if (stored !== null) {
		try {
			return {
				...defaultSettings,
				...JSON.parse(stored),
			}
		} catch {
			console.debug(`[Settings]`, `Failed to parse`, stored)
			return defaultSettings
		}
	}
	return defaultSettings
}

export const SettingsContext = createContext<{
	settings: Settings
	update: (newSettings: Partial<Settings>) => void
	reset: () => void
}>({
	settings: defaultSettings,
	update: () => undefined,
	reset: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [settings, updateSettings] = useState<Settings>(loadDefaults())

	console.debug(`[Settings]`, settings)

	return (
		<SettingsContext.Provider
			value={{
				settings: settings,
				update: (newSettings) => {
					updateSettings((settings) => {
						const merged = { ...settings, ...newSettings }
						localStorage.setItem('settings', JSON.stringify(merged))
						return merged
					})
				},
				reset: () => {
					localStorage.removeItem('settings')
					updateSettings(defaultSettings)
				},
			}}
		>
			{children}
		</SettingsContext.Provider>
	)
}

export const Consumer = SettingsContext.Consumer

export const useSettings = () => useContext(SettingsContext)

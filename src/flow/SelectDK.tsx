import { DKSelector } from '@components/DKSelector'
import { SelectedDK } from '@components/SelectedDK'
import { useSettings } from '@context/Settings'

export const SelectDK = () => {
	const { settings, reset, update } = useSettings()

	if (settings.selectedDK !== undefined)
		return (
			<SelectedDK
				selected={settings.selectedDK}
				clearSelection={() => reset()}
			/>
		)

	return (
		<DKSelector onSelect={(selection) => update({ selectedDK: selection })} />
	)
}

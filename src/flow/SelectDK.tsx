import { DKSelector } from '@components/DKSelector'
import { SelectedDK } from '@components/SelectedDK'
import { useSettings } from '@context/Settings'
import { DK, DKs } from '../DKs'

export const SelectDK = () => {
	const { settings, reset, update } = useSettings()

	if (settings.selectedDK !== undefined)
		return (
			<SelectedDK
				selected={DKs[settings.selectedDK] as DK}
				clear={() => reset()}
				setIMEIandPIN={({ imei, pin }) =>
					update({
						dkCredentials: {
							pin,
							imei,
						},
					})
				}
			/>
		)

	return (
		<DKSelector onSelect={(selection) => update({ selectedDK: selection })} />
	)
}

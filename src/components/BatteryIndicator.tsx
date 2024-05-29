import {
	Battery as BatteryIcon,
	BatteryFull,
	BatteryLow,
	BatteryMedium,
	BatteryWarning,
} from 'lucide-preact'

export const BatteryIndicator = ({ percentage }: { percentage: number }) => {
	if (percentage < 10)
		return (
			<BatteryWarning
				class="me-1"
				style={{ color: 'var(--color-nordic-red)' }}
			/>
		)
	if (percentage < 20)
		return (
			<BatteryIcon class="me-1" style={{ color: 'var(--color-nordic-red)' }} />
		)
	if (percentage < 50)
		return (
			<BatteryLow class="me-1" style={{ color: 'var(--color-nordic-sun)' }} />
		)
	if (percentage < 80)
		return (
			<BatteryMedium
				class="me-1"
				style={{ color: 'var(--color-nordic-sun)' }}
			/>
		)
	return (
		<BatteryFull class="me-1" style={{ color: 'var(--color-nordic-power)' }} />
	)
}

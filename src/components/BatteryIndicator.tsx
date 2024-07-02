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
				title="Warning: Battery level below 10%"
				style={{ color: 'var(--color-nordic-red)' }}
				data-testid="battery-indicator"
			/>
		)
	if (percentage < 20)
		return (
			<BatteryIcon
				title="Battery level below 20%"
				class="me-1"
				style={{ color: 'var(--color-nordic-red)' }}
				data-testid="battery-indicator"
			/>
		)
	if (percentage < 50)
		return (
			<BatteryLow
				title="Battery level below 50%"
				class="me-1"
				style={{ color: 'var(--color-nordic-sun)' }}
				data-testid="battery-indicator"
			/>
		)
	if (percentage < 80)
		return (
			<BatteryMedium
				class="me-1"
				title="Battery level below 80%"
				style={{ color: 'var(--color-nordic-sun)' }}
				data-testid="battery-indicator"
			/>
		)
	return (
		<BatteryFull
			title="Battery level above 80%"
			class="me-1"
			style={{ color: 'var(--color-nordic-power)' }}
			data-testid="battery-indicator"
		/>
	)
}

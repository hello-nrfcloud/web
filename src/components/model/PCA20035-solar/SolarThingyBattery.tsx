import { Ago } from '#components/Ago.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { useSolarThingyHistory } from '#context/models/PCA20035-solar.js'
import {
	Battery,
	BatteryFull,
	BatteryLow,
	BatteryMedium,
	BatteryWarning,
} from 'lucide-preact'

export const SolarThingyBattery = () => (
	<>
		<h2>Battery</h2>
		<p class="mb-0 d-flex align-items-center">
			<BatteryInfo />
		</p>
		<p>
			<small class="text-muted">
				This is the value reported by the PMIC's fuel gauge function that
				represents the charge level of the battery in percent.
			</small>
		</p>
	</>
)

export const BatteryInfo = () => {
	const { battery } = useSolarThingyHistory()
	const batteryReading = battery[0]
	if (batteryReading === undefined) return <LoadingIndicator width={150} />
	return (
		<span>
			<BatteryIndicator percentage={batteryReading['%']} />
			{batteryReading['%']} %{' '}
			<small class="text-muted ms-1">
				(<Ago date={new Date(batteryReading.ts)} />)
			</small>
		</span>
	)
}

const BatteryIndicator = ({ percentage }: { percentage: number }) => {
	if (percentage < 10)
		return (
			<BatteryWarning
				class="me-1"
				style={{ color: 'var(--color-nordic-red)' }}
			/>
		)
	if (percentage < 20)
		return <Battery class="me-1" style={{ color: 'var(--color-nordic-red)' }} />
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

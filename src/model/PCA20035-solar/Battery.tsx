import { Ago } from '#components/Ago.js'
import { BatteryIndicator } from '#components/BatteryIndicator.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDevice } from '#context/Device.js'
import { isBatteryAndPower, toBatteryAndPower } from '#proto/lwm2m.js'

export const Battery = () => (
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

const BatteryInfo = () => {
	const { reported } = useDevice()
	const batteryReading = Object.values(reported)
		.filter(isBatteryAndPower)
		.map(toBatteryAndPower)[0]

	if (batteryReading?.['%'] === undefined)
		return <LoadingIndicator width={150} />
	return (
		<span>
			<BatteryIndicator percentage={batteryReading['%']} />
			{batteryReading['%']} %{' '}
			<small class="text-muted ms-1">
				<Ago date={batteryReading.ts} key={batteryReading.ts.toISOString()} />
			</small>
		</span>
	)
}

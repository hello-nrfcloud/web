import { Ago } from '#components/Ago.js'
import { BatteryIndicator } from '#components/BatteryIndicator.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDevice } from '#context/Device.js'
import { isBatteryAndPower, toBatteryAndPower } from '#proto/lwm2m.js'

export const BatteryInfo = () => {
	const { reported } = useDevice()
	const batteryReading = Object.values(reported)
		.filter(isBatteryAndPower)
		.map(toBatteryAndPower)[0]

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Battery</strong>
			</small>
			{batteryReading === undefined && (
				<>
					<LoadingIndicator width={150} />
					<LoadingIndicator height={16} width={100} class="mt-1" />
				</>
			)}
			{batteryReading?.['%'] !== undefined && (
				<span>
					<BatteryIndicator percentage={batteryReading['%']} />
					{batteryReading['%']} % <small class="text-muted ms-1"></small>
				</span>
			)}

			{batteryReading !== undefined && (
				<small class="text-muted">
					<Ago date={batteryReading.ts} key={batteryReading.ts.toISOString()} />
				</small>
			)}
		</span>
	)
}

import { DateRangeButton } from '#chart/DateRangeButton.js'
import { HistoryChart } from '#chart/HistoryChart.js'
import { timeSpans } from '#chart/timeSpans.js'
import { Ago } from '#components/Ago.js'
import { WithResize } from '#components/ResizeObserver.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { WaitingForData } from '#components/WaitingForData.js'
import { useDevice } from '#context/Device.js'
import { useHistory } from '#model/PCA20035-solar/HistoryContext.js'
import { toChartData } from '#model/PCA20035-solar/toChartData.js'
import {
	byTimestamp,
	isBatteryAndPower,
	isSolarCharge,
	toBatteryAndPower,
	toSolarCharge,
} from '#proto/lwm2m.js'
import { formatFloat } from '#utils/format.js'
import { BatteryCharging, Sun } from 'lucide-preact'

export const Chart = () => (
	<>
		<SolarChart />
		<div class="bg-blue">
			<div class="container py-4">
				<div class="row">
					<div class="col">
						<FirmwareInfo />
					</div>
				</div>
			</div>
		</div>
	</>
)

const SolarChart = () => {
	const { battery, gain, timeSpan, setTimeSpan } = useHistory()

	const hasChartData = gain.length + battery.length > 0

	return (
		<div class="bg-blue-soft">
			<div class="container py-4">
				{hasChartData && (
					<WithResize>
						{(size) => (
							<HistoryChart
								data={toChartData({ battery, gain, type: timeSpan })}
								size={size}
							/>
						)}
					</WithResize>
				)}
				{!hasChartData && (
					<div class="d-flex align-items-center justify-content-center h-100">
						<WaitingForData />
					</div>
				)}
			</div>
			<div class="row ms-1">
				<div class="col d-flex justify-content-start align-items-center">
					<span class="me-2 opacity-75">Chart history:</span>
					{timeSpans.map(({ id, title }) => (
						<DateRangeButton
							class="ms-1"
							disabled={id === timeSpan}
							onClick={() => {
								setTimeSpan(id)
							}}
							label={title}
							active={timeSpan === id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

const FirmwareInfo = () => {
	const { reported } = useDevice()

	const currentBattery = Object.values(reported)
		.filter(isBatteryAndPower)
		.sort(byTimestamp)
		.map(toBatteryAndPower)[0]
	const currentGain = Object.values(reported)
		.filter(isSolarCharge)
		.sort(byTimestamp)
		.map(toSolarCharge)[0]

	return (
		<>
			<p>
				The Thingy:91 runs the{' '}
				<a
					href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html"
					target="_blank"
				>
					<code>asset_tracker_v2</code>
				</a>{' '}
				application configured in low-power mode, requires 3.4 mA when sending
				updates to the cloud every minute, or 2.3 mA when sending updates to the
				cloud every hour.
			</p>
			<dl>
				<>
					<dt style={{ color: 'var(--color-nordic-sun)' }}>
						<Sun /> Gain
					</dt>
					<dd
						style={{ color: 'var(--color-nordic-sun)' }}
						class="d-flex flex-column"
					>
						{currentGain === undefined && <LoadingIndicator light />}
						{currentGain !== undefined && (
							<>
								<span>{formatFloat(currentGain.mA)} mA</span>
								<small>
									<Ago
										date={currentGain.ts}
										key={currentGain.ts.toISOString()}
									/>
								</small>
							</>
						)}
					</dd>
				</>
				<>
					<dt style={{ color: 'var(--color-nordic-grass)' }}>
						<BatteryCharging /> Battery
					</dt>
					<dd
						style={{ color: 'var(--color-nordic-grass)' }}
						class="d-flex flex-column"
					>
						{currentBattery === undefined && <LoadingIndicator light />}
						{currentBattery !== undefined && (
							<>
								{currentBattery['%']} %{' '}
								<small>
									<Ago
										date={currentBattery.ts}
										key={currentBattery.ts.toISOString()}
									/>
								</small>
							</>
						)}
					</dd>
				</>
			</dl>
		</>
	)
}

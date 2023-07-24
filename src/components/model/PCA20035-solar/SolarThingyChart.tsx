import { HistoryChart } from '#chart/HistoryChart.js'
import { Ago } from '#components/Ago.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { formatFloat } from '#utils/formatFloat.js'
import { BatteryCharging, Sun } from 'lucide-preact'
import { useSolarThingyHistory } from '../../../context/models/PCA20035-solar.js'
import { toChartData } from '../../../chart/toChartData.js'
import { DateRangeButton } from '../../../chart/DateRangeButton.js'
import { WithResize } from '#components/ResizeObserver.js'
import { WaitingForData } from '#components/WaitingForData.js'

export const SolarThingyChart = () => {
	const { gain, battery, chartType, chartTypes, setChartType } =
		useSolarThingyHistory()

	const currentGain = gain?.filter(({ fromHistory }) => fromHistory !== true)[0]
	const currentBattery = battery.filter(
		({ fromHistory }) => fromHistory !== true,
	)[0]

	const hasChartData = gain.length + battery.length > 0

	return (
		<>
			<div
				class="container py-4"
				style={{ backgroundColor: 'var(--color-nordic-lake)' }}
			>
				{hasChartData && (
					<>
						<div class="d-flex justify-content-end align-items-center mb-3">
							<span class="text-light me-2 opacity-50">change date range:</span>
							{chartTypes.map(({ id, title }) => (
								<DateRangeButton
									class="ms-1"
									disabled={id === chartType}
									onClick={() => {
										setChartType(id)
									}}
									label={title}
									active={chartType === id}
								/>
							))}
						</div>
						<WithResize>
							{(size) => (
								<HistoryChart
									data={toChartData({ gain, battery, type: chartType })}
									size={size}
								/>
							)}
						</WithResize>
					</>
				)}
				{!hasChartData && (
					<div class="text-light d-flex align-items-center justify-content-center h-100">
						<WaitingForData />
					</div>
				)}
			</div>

			<div
				class="container pt-4 pb-4"
				style={{ backgroundColor: 'rgba(var(--color-nordic-lake-rgb),0.8)' }}
			>
				<p class="text-light">
					The Thingy:91 runs the{' '}
					<a
						href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html"
						target="_blank"
						class="text-light"
					>
						<code>asset_tracker_v2</code>
					</a>{' '}
					application configured in low-power mode, requires 3.4 mA when sending
					updates to the cloud every minute, or 2.3 mA when sending updates to
					the cloud.
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
										<Ago date={new Date(currentGain.ts)} />
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
										<Ago date={new Date(currentBattery.ts)} />
									</small>
								</>
							)}
						</dd>
					</>
				</dl>
			</div>
		</>
	)
}

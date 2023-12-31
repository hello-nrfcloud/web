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
import { timeSpans } from '#chart/timeSpans.js'

export const SolarThingyChart = () => {
	const { gain, battery, timeSpan, setTimeSpan } = useSolarThingyHistory()

	const currentGain = gain?.filter(({ fromHistory }) => fromHistory !== true)[0]
	const currentBattery = battery.filter(
		({ fromHistory }) => fromHistory !== true,
	)[0]

	const hasChartData = gain.length + battery.length > 0

	return (
		<>
			<div class="bg-blue-soft">
				<div class="container py-4">
					{hasChartData && (
						<WithResize>
							{(size) => (
								<HistoryChart
									data={toChartData({ gain, battery, type: timeSpan })}
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
			</div>
			<div class="bg-blue">
				<div class="container py-4">
					<div class="row mb-4">
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
					<div class="row">
						<div class="col">
							<p>
								The Thingy:91 runs the{' '}
								<a
									href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html"
									target="_blank"
								>
									<code>asset_tracker_v2</code>
								</a>{' '}
								application configured in low-power mode, requires 3.4 mA when
								sending updates to the cloud every minute, or 2.3 mA when
								sending updates to the cloud every hour.
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
					</div>
				</div>
			</div>
		</>
	)
}

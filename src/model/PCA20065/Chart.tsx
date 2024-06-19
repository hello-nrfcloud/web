import { DateRangeButton } from '#chart/DateRangeButton.js'
import { HistoryChart } from '#chart/HistoryChart.js'
import { timeSpans } from '#chart/timeSpans.js'
import { WithResize } from '#components/ResizeObserver.js'
import { useDevice } from '#context/Device.js'
import { useHistory } from '#model/PCA20065/HistoryContext.js'
import { toChartData } from '#model/PCA20065/toChartData.js'
import { CircleIcon, DotIcon } from 'lucide-preact'

export const Chart = () => {
	const { lastSeen } = useDevice()
	const { battery, reboots, timeSpan, setTimeSpan } = useHistory()

	if (lastSeen === undefined) {
		return null
	}

	return (
		<div class="bg-blue-soft">
			<div class="container py-4">
				<header class="col d-flex align-items-center justify-content-between">
					<h2>History</h2>
					<div class="d-flex align-items-center">
						{battery.length > 0 && (
							<small
								class="d-flex align-items-center me-2"
								style={{ color: 'var(--color-nordic-grass)' }}
							>
								<CircleIcon size={14} strokeWidth={3} class="me-1" />
								State of Charge
							</small>
						)}
						{reboots.length > 0 && (
							<small
								class="d-flex align-items-center"
								style={{
									color: 'var(--color-nordic-pink)',
									textShadow: '0px 0px 2px #000',
								}}
							>
								<DotIcon size={14} strokeWidth={6} class="me-1" />
								Reboot
							</small>
						)}
					</div>
				</header>

				<WithResize>
					{(size) => (
						<HistoryChart
							data={toChartData({ battery, reboots, type: timeSpan })}
							size={size}
						/>
					)}
				</WithResize>

				<div class="row px-4 py-4">
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
		</div>
	)
}

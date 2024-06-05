import { DateRangeButton } from '#chart/DateRangeButton.js'
import { HistoryChart } from '#chart/HistoryChart.js'
import { timeSpans } from '#chart/timeSpans.js'
import { WithResize } from '#components/ResizeObserver.js'
import { useDevice } from '#context/Device.js'
import { useHistory } from '#model/PCA20065/HistoryContext.js'
import { toChartData } from '#model/PCA20065/toChartData.js'

export const BatteryChart = () => {
	const { lastSeen } = useDevice()
	const { battery, timeSpan, setTimeSpan } = useHistory()

	if (lastSeen === undefined) {
		return null
	}

	return (
		<div class="bg-blue-soft">
			<div class="container py-4">
				<h2>State of charge</h2>
				<WithResize>
					{(size) => (
						<HistoryChart
							data={toChartData({ battery, type: timeSpan })}
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

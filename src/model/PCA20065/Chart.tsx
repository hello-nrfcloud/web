import { DateRangeButton } from '#chart/DateRangeButton.js'
import { HistoryChart } from '#chart/HistoryChart.js'
import { timeSpans } from '#chart/timeSpans.js'
import { toChartData } from '#model/PCA20065/toChartData.js'
import { WithResize } from '#components/ResizeObserver.js'
import { WaitingForData } from '#components/WaitingForData.js'
import { useHistory } from '#model/PCA20065/HistoryContext.js'

export const BatteryChart = () => {
	const { battery, timeSpan, setTimeSpan } = useHistory()

	const hasChartData = battery.length > 0

	return (
		<div class="bg-blue-soft">
			<div class="container py-4">
				{hasChartData && (
					<WithResize>
						{(size) => (
							<HistoryChart
								data={toChartData({ battery, type: timeSpan })}
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

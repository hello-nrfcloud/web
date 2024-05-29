import type { TimeSpan } from '#api/api.js'
import type { ChartData } from '#chart/chartMath.js'
import { xAxisForType } from '#chart/xAxisForType.js'
import {
	type BatteryReading,
	type BatteryReadings,
} from '#model/PCA20065/HistoryContext.js'
import { subHours, subMilliseconds } from 'date-fns'

export const toChartData = ({
	battery,
	type,
}: {
	battery: BatteryReadings
	type: TimeSpan
}): ChartData => {
	const base = new Date(
		battery[battery.length - 1]?.ts ?? subHours(new Date(), 1).getTime(),
	)

	const stateOfCharge = battery.filter(hasStateOfCharge)

	return {
		xAxis: xAxisForType(type),
		datasets: [
			// Battery percentage
			{
				min: 0,
				max: 100,
				values: stateOfCharge.map(({ '%': percent, ts }) => [
					percent,
					subMilliseconds(base, base.getTime() - ts),
				]),
				color: 'var(--color-nordic-grass)',
				format: (v) => `${v} %`,
			},
		],
	}
}

const hasStateOfCharge = (
	message: BatteryReading,
): message is { '%': number; ts: number } => '%' in message

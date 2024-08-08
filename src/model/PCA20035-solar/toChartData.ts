import type { TimeSpan } from '#api/api.js'
import type { ChartData } from '#chart/chartMath.js'
import { xAxisForType } from '#chart/xAxisForType.js'
import {
	type BatteryReading,
	type BatteryReadings,
	type GainReadings,
} from '#model/PCA20035-solar/HistoryContext.js'
import { formatFloat } from '#utils/format.js'
import { subHours, subMilliseconds } from 'date-fns'

export const toChartData = ({
	battery,
	gain,
	type,
}: {
	battery: BatteryReadings
	gain: GainReadings
	type: TimeSpan
}): ChartData => {
	const base = new Date(
		battery[battery.length - 1]?.ts ?? subHours(new Date(), 1).getTime(),
	)

	const stateOfCharge = battery.filter(hasStateOfCharge)

	return {
		xAxis: xAxisForType(type),
		datasets: [
			// Gain
			{
				min: 0,
				max: 6.5,
				values: gain.map(({ mA, ts }) => [
					mA,
					subMilliseconds(base, base.getTime() - ts.getTime()),
				]),
				color: 'var(--color-nordic-sun)',
				format: (v) => `${formatFloat(v)} mA`,
				helperLines: [
					{
						label: '1m',
						value: 3.4, // gainReferenceEveryMinute
					},
					{
						label: '60m',
						value: 2.3, // gainReferenceEveryHour
					},
				],
			},
			// Battery percentage
			{
				min: 0,
				max: 100,
				values: stateOfCharge.map(({ '%': percent, ts }) => [
					percent,
					subMilliseconds(base, base.getTime() - ts.getTime()),
				]),
				color: 'var(--color-nordic-grass)',
				format: (v) => `${v} %`,
			},
		],
	}
}

const hasStateOfCharge = (
	message: BatteryReading,
): message is { '%': number; ts: Date } => '%' in message

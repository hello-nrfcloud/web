import type { TimeSpan } from '#api/api.js'
import type { ChartData } from '#chart/chartMath.js'
import { subHours, subMilliseconds } from 'date-fns'
import {
	type BatteryReading,
	type BatteryReadings,
	type GainReadings,
} from '../context/models/PCA20035-solar.js'
import { xAxisForType } from './xAxisForType.js'

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
					subMilliseconds(base, base.getTime() - ts),
				]),
				color: 'var(--color-nordic-sun)',
				format: (v) => `${v.toFixed(1)} mA`,
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

import type { ChartData } from '#chart/chartMath.js'
import { subHours, subMilliseconds } from 'date-fns'
import {
	type GainReadings,
	type BatteryReadings,
} from '../context/models/PCA20035-solar.js'
import type { Static } from '@sinclair/typebox'
import type { ChartType } from '@hello.nrfcloud.com/proto/hello/chart'
import { xAxisForType } from './xAxisForType.js'

export const toChartData = ({
	gain,
	battery,
	type,
}: {
	gain: GainReadings
	battery: BatteryReadings
	type: Static<typeof ChartType>
}): ChartData => {
	const base = new Date(
		gain[gain.length - 1]?.ts ?? subHours(new Date(), 1).getTime(),
	)

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
				values: battery.map(({ '%': percent, ts }) => [
					percent,
					subMilliseconds(base, base.getTime() - ts),
				]),
				color: 'var(--color-nordic-grass)',
				format: (v) => `${v} %`,
			},
		],
	}
}

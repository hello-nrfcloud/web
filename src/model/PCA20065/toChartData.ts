import type { TimeSpan } from '#api/api.js'
import type { ChartData } from '#chart/chartMath.js'
import { xAxisForType } from '#chart/xAxisForType.js'
import type { BatteryAndPower, Reboot } from '#proto/lwm2m.js'
import { subHours, subMilliseconds } from 'date-fns'

export const toChartData = ({
	battery,
	reboots,
	type,
}: {
	battery: Array<BatteryAndPower>
	reboots: Array<Reboot>
	type: TimeSpan
}): ChartData => {
	const base = new Date(
		battery[battery.length - 1]?.ts.getTime() ??
			subHours(new Date(), 1).getTime(),
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
					subMilliseconds(base, base.getTime() - ts.getTime()),
				]),
				color: 'var(--color-nordic-grass)',
				format: (v) => `${Math.round(v)} %`,
			},
		],
		// Reboots
		events: [
			{
				color: 'var(--color-nordic-red)',
				events: reboots.map(({ ts }) => ts),
			},
		],
	}
}

const hasStateOfCharge = (
	message: BatteryAndPower,
): message is { '%': number; ts: Date } => '%' in message

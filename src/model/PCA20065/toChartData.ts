import type { TimeSpan } from '#api/api.js'
import type { ChartData } from '#chart/chartMath.js'
import { xAxisForType } from '#chart/xAxisForType.js'
import type { SIMUsageHistory } from '#context/SIMUsageHistory.js'
import type { BatteryAndPower, Reboot } from '#proto/lwm2m.js'
import { subHours, subMilliseconds } from 'date-fns'

export const toChartData = ({
	battery,
	reboots,
	simUsage,
	type,
}: {
	battery: Array<BatteryAndPower>
	reboots: Array<Reboot>
	simUsage: Array<SIMUsageHistory>
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
			// SIM Usage
			{
				min: 0,
				max: Math.max(...simUsage.map((s) => s.usedBytes), 100000) / 1000,
				values: simUsage.map(({ usedBytes, ts }) => [
					usedBytes / 1000,
					subMilliseconds(base, base.getTime() - ts.getTime()),
				]),
				color: 'var(--color-nordic-fall)',
				format: (v) => `${Math.ceil(v)} kb`,
			},
		],
		// Reboots
		events: [
			{
				color: 'var(--color-reboot)',
				events: reboots.map(({ ts }) => ts),
			},
		],
	}
}

const hasStateOfCharge = (
	message: BatteryAndPower,
): message is { '%': number; ts: Date } => '%' in message

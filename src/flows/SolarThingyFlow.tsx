import { HistoryChart } from '#chart/HistoryChart.js'
import type { ChartData } from '#chart/chartMath.js'
import { Ago } from '#components/Ago.js'
import { ConnectDK } from '#components/ConnectDK.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { formatFloat } from '#utils/formatFloat.js'
import { format, subHours, subMilliseconds } from 'date-fns'
import { BatteryCharging, Sun } from 'lucide-preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useSolarThingyHistory } from '../context/models/PCA20035-solar.js'

export const SolarThingyFlow = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [chartSize, setChartSize] = useState<[width: number, height: number]>([
		300, 200,
	])
	const { gain, battery } = useSolarThingyHistory()

	useEffect(() => {
		if (containerRef.current === null) return
		const { width } = containerRef.current.getBoundingClientRect()
		setChartSize([width, width * 0.5])
	}, [containerRef.current])

	const currentGain = gain[0]
	const currentBattery = battery[0]

	const base = new Date(
		gain[gain.length - 1]?.ts ?? subHours(new Date(), 1).getTime(),
	)

	const chartData: ChartData = {
		xAxis: {
			color: 'var(--color-nordic-light-grey)',
			labelEvery: 10,
			minutes: 60,
			format: (d) => format(d, 'HH:mm'),
			hideLabels: false,
		},
		datasets: [
			// Gain
			{
				min: 0,
				max: 5,
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

	return (
		<>
			{currentGain === undefined && currentBattery === undefined && (
				<div
					style={{ backgroundColor: 'var(--color-nordic-light-grey)' }}
					class="py-4"
				>
					<div class="container">
						<div class="row">
							<div class="col-12">
								<ConnectDK />
							</div>
						</div>
					</div>
				</div>
			)}
			{(battery.length > 0 || gain.length > 0) && (
				<div
					class="container pt-4 pb-4"
					style={{ backgroundColor: 'var(--color-nordic-lake)' }}
				>
					<div ref={containerRef}>
						<HistoryChart
							width={chartSize[0]}
							height={chartSize[1]}
							data={chartData}
						/>
					</div>
				</div>
			)}
			<div
				class="container pt-4 pb-4"
				style={{ backgroundColor: 'var(--color-nordic-blueslate)' }}
			>
				<p class="text-light">
					The Thingy:91 runs the{' '}
					<a
						href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html"
						target="_blank"
					>
						<code>asset_tracker_v2</code>
					</a>{' '}
					application configured in low-power mode, requires 3.4 mA when sending
					updates to the cloud every minute, or 2.3 mA when sending updates to
					the cloud.
				</p>
				<dl>
					<>
						<dt style={{ color: 'var(--color-nordic-sun)' }}>
							<Sun /> Gain
						</dt>
						<dd
							style={{ color: 'var(--color-nordic-sun)' }}
							class="d-flex flex-direction-column"
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
							class="d-flex flex-direction-column"
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
		</>
	)
}

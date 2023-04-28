import { Context, MuninnMessage } from '@bifravst/muninn-proto/Muninn'
import { HistoryChart } from '@chart/HistoryChart'
import type { ChartData } from '@chart/chartMath'
import { Ago } from '@components/Ago'
import { useDevice, type MessageListenerFn } from '@context/Device'
import { WaitingForData } from '@flows/WaitingForData.js'
import { type Static } from '@sinclair/typebox'
import { format, subHours, subMilliseconds } from 'date-fns'
import { BatteryCharging, Sun } from 'lucide-preact'
import { useEffect, useRef, useState } from 'preact/hooks'

type Gain = {
	'@context': string
	mA: number
	ts: number
}
type Voltage = {
	'@context': string
	v: number
	ts: number
}
const solarThingy = Context.model('PCA20035+solar')
const isGain = (message: Static<typeof MuninnMessage>): message is Gain =>
	message['@context'] === solarThingy.transformed('gain').toString()

const isVoltage = (message: Static<typeof MuninnMessage>): message is Voltage =>
	message['@context'] === solarThingy.transformed('voltage').toString()

export const SolarThingyFlow = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [chartSize, setChartSize] = useState<[width: number, height: number]>([
		300, 200,
	])
	const { addMessageListener, removeMessageListener } = useDevice()

	const [gain, setGain] = useState<{ mA: number; ts: number }[]>([])
	const [voltage, setVoltage] = useState<{ v: number; ts: number }[]>([])

	const onMessage: MessageListenerFn = (message) => {
		if (isGain(message)) {
			console.log(`[Solar]`, message)
			setGain((g) => [message, ...g].sort(({ ts: t1 }, { ts: t2 }) => t2 - t1))
		}
		if (isVoltage(message)) {
			console.log(`[Solar]`, message)
			setVoltage((v) =>
				[message, ...v].sort(({ ts: t1 }, { ts: t2 }) => t2 - t1),
			)
		}
	}

	useEffect(() => {
		addMessageListener(onMessage)

		return () => {
			removeMessageListener(onMessage)
		}
	}, [])

	useEffect(() => {
		if (containerRef.current === null) return
		const { width } = containerRef.current.getBoundingClientRect()
		setChartSize([width, width * 0.5])
	}, [containerRef.current])

	const currentGain = gain[0]
	const currentVoltage = voltage[0]

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
				format: (v) => `${v.toFixed(1)}mA`,
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
			// Voltage
			{
				min: 2.5,
				max: 5.5,
				values: voltage.map(({ v, ts }) => [
					v,
					subMilliseconds(base, base.getTime() - ts),
				]),
				color: 'var(--color-nordic-grass)',
				format: (v) => `${v.toFixed(1)}V`,
			},
		],
	}

	return (
		<div style={{ backgroundColor: 'var(--color-nordic-lake)' }}>
			<div class="container pt-4 pb-4">
				<dl>
					<>
						<dt style={{ color: 'var(--color-nordic-sun)' }}>
							<Sun /> Gain
						</dt>
						<dd style={{ color: 'var(--color-nordic-sun)' }}>
							{currentGain === undefined && <WaitingForData />}
							{currentGain !== undefined && (
								<>
									{currentGain.mA} mA{' '}
									<small>
										(<Ago date={new Date(currentGain.ts)} />)
									</small>
								</>
							)}
						</dd>
					</>
					<>
						<dt style={{ color: 'var(--color-nordic-grass)' }}>
							<BatteryCharging /> Voltage
						</dt>
						<dd style={{ color: 'var(--color-nordic-grass)' }}>
							{currentVoltage === undefined && <WaitingForData />}
							{currentVoltage !== undefined && (
								<>
									{currentVoltage.v} V{' '}
									<small>
										(<Ago date={new Date(currentVoltage.ts)} />)
									</small>
								</>
							)}
						</dd>
					</>
				</dl>
				{(voltage.length > 0 || gain.length > 0) && (
					<div ref={containerRef}>
						<HistoryChart
							width={chartSize[0]}
							height={chartSize[1]}
							data={chartData}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

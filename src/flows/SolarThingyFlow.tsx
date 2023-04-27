import { Context, MuninnMessage } from '@bifravst/muninn-proto/Muninn'
import { Ago } from '@components/Ago'
import { useDevice, type Device, type MessageListenerFn } from '@context/Device'
import { type Static } from '@sinclair/typebox'
import { Clock12, CloudOff } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'

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

export const SolarThingyFlow = ({ device }: { device: Device }) => {
	const { addMessageListener, removeMessageListener } = useDevice()

	const [gain, setGain] = useState<{ mA: number; ts: number }[]>([])
	const [voltage, setVoltage] = useState<{ v: number; ts: number }[]>([])

	const onMessage: MessageListenerFn = (message) => {
		if (isGain(message)) {
			console.log(`[Solar]`, message)
			setGain((g) => [message, ...g])
		}
		if (isVoltage(message)) {
			console.log(`[Solar]`, message)
			setVoltage((v) => [message, ...v])
		}
	}

	useEffect(() => {
		addMessageListener(onMessage)

		return () => {
			removeMessageListener(onMessage)
		}
	}, [])

	const currentGain = gain[0]
	const currentVoltage = voltage[0]

	return (
		<div class="container pt-4 pb-4">
			<dl>
				<>
					<dt>Gain</dt>
					<dd>
						{currentGain === undefined && <WaitingForData />}
						{currentGain !== undefined && (
							<>
								{currentGain.mA} mA{' '}
								<small>
									<Ago date={new Date(currentGain.ts)} />
								</small>
							</>
						)}
						{gain.length > 1 && (
							<>
								<br />
								History:{' '}
								{gain.slice(1).map(({ mA }) => (
									<span>{mA}</span>
								))}
							</>
						)}
					</dd>
				</>
				<>
					<dt>Voltage</dt>
					<dd>
						{currentVoltage === undefined && <WaitingForData />}
						{currentVoltage !== undefined && (
							<>
								{currentVoltage.v} V{' '}
								<small>
									<Ago date={new Date(currentVoltage.ts)} />
								</small>
							</>
						)}
						{voltage.length > 1 && (
							<>
								<br />
								History:{' '}
								{voltage.slice(1).map(({ v }) => (
									<span>{v}</span>
								))}
							</>
						)}
					</dd>
				</>
			</dl>
		</div>
	)
}

const WaitingForData = () => {
	const [seconds, setSeconds] = useState<number>(0)

	useEffect(() => {
		const i = setInterval(() => {
			setSeconds((s) => ++s)
		}, 1000)

		return () => {
			clearInterval(i)
		}
	}, [])

	return (
		<small>
			<CloudOff /> waiting for data <ClockForNumber seconds={seconds} />{' '}
			{seconds}s
		</small>
	)
}

const ClockForNumber = ({ seconds }: { seconds: number }) => (
	<Clock12
		style={{ rotate: `${Math.floor(((seconds % 60) / 60) * 360)}deg` }}
		strokeWidth={1.5}
	/>
)

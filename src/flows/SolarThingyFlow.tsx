import { Ago } from '@components/Ago'
import { useDevice, type Device, type MessageListenerFn } from '@context/Device'
import { Context, NRFGuideMessage } from '@nrf-guide/proto/nrfGuide'
import { type Static } from '@sinclair/typebox'
import {
	Clock1,
	Clock10,
	Clock11,
	Clock12,
	Clock2,
	Clock3,
	Clock4,
	Clock5,
	Clock6,
	Clock7,
	Clock8,
	Clock9,
	CloudOff,
} from 'lucide-preact'
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
const isGain = (message: Static<typeof NRFGuideMessage>): message is Gain =>
	message['@context'] === solarThingy.transformed('gain').toString()

const isVoltage = (
	message: Static<typeof NRFGuideMessage>,
): message is Voltage =>
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

const ClockForNumber = ({ seconds }: { seconds: number }) => {
	switch (seconds % 12) {
		case 1:
			return <Clock1 />
		case 2:
			return <Clock2 />
		case 3:
			return <Clock3 />
		case 4:
			return <Clock4 />
		case 5:
			return <Clock5 />
		case 6:
			return <Clock6 />
		case 7:
			return <Clock7 />
		case 8:
			return <Clock8 />
		case 9:
			return <Clock9 />
		case 10:
			return <Clock10 />
		case 11:
			return <Clock11 />
		default:
			return <Clock12 />
	}
}

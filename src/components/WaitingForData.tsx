import { formatDistance } from '#utils/format.ts'
import { Clock12, CloudOff } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'

export const WaitingForData = () => {
	const [seconds, setSeconds] = useState<number>(0)

	useEffect(() => {
		const i = setInterval(() => {
			setSeconds((s) => s + 1)
		}, 1000)

		return () => {
			clearInterval(i)
		}
	}, [])

	return (
		<small>
			<CloudOff /> waiting for data <ClockForNumber seconds={seconds} />{' '}
			{formatDistance(seconds)}
		</small>
	)
}
const ClockForNumber = ({ seconds }: { seconds: number }) => (
	<Clock12
		style={{ rotate: `${Math.floor(((seconds % 60) / 60) * 360)}deg` }}
		strokeWidth={1.5}
	/>
)

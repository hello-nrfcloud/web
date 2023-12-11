import { formatDistanceToNowStrict } from 'date-fns'
import { HistoryIcon } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'

export const Ago = ({
	date,
	withSeconds,
	strokeWidth,
	size,
}: {
	date: Date
	withSeconds?: true
	strokeWidth?: number
	size?: number
}) => {
	const [relTime, setRelTime] = useState<string>(distance(date, withSeconds))

	useEffect(() => {
		const delta = Date.now() - date.getTime()
		let i = setInterval(
			() => {
				setRelTime(distance(date, withSeconds))
				if (withSeconds && delta > 60 * 1000) {
					clearInterval(i)
					i = setInterval(() => {
						setRelTime(distance(date))
					}, 60 * 1000)
				}
			},
			withSeconds ? 1000 : 60 * 1000,
		)

		return () => {
			clearInterval(i)
		}
	}, [date, withSeconds])

	return (
		<time dateTime={date.toISOString()} class="text-nowrap">
			<HistoryIcon
				strokeWidth={strokeWidth ?? 1}
				size={size ?? 20}
				class="me-1"
			/>
			{relTime}
		</time>
	)
}

export const distance = (to: Date, withSeconds?: true) =>
	withSeconds ?? false
		? formatDistanceToNowStrict(to)
		: Date.now() - to.getTime() < 60 * 1000
			? '<1 minute'
			: formatDistanceToNowStrict(to)

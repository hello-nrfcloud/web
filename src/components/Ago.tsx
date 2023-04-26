import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'preact/hooks'

export const Ago = ({ date }: { date: Date }) => {
	const [relTime, setRelTime] = useState<string>(
		formatDistanceToNow(date, { addSuffix: true }),
	)

	useEffect(() => {
		const i = setInterval(() => {
			setRelTime(formatDistanceToNow(date, { addSuffix: true }))
		}, 10 * 1000)

		return () => {
			clearInterval(i)
		}
	}, [date])

	return <time dateTime={date.toISOString()}>{relTime}</time>
}

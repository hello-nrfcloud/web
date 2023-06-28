import { formatDistanceToNowStrict } from 'date-fns'
import { UploadCloudIcon } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'

export const Ago = ({ date }: { date: Date }) => {
	const [relTime, setRelTime] = useState<string>(distance(date))

	useEffect(() => {
		const i = setInterval(() => {
			setRelTime(distance(date))
		}, 60 * 1000)

		return () => {
			clearInterval(i)
		}
	}, [date])

	return (
		<time dateTime={date.toISOString()} class="text-nowrap">
			<UploadCloudIcon strokeWidth={1} size={20} class="me-1" />
			{relTime}
		</time>
	)
}

const distance = (to: Date) =>
	Date.now() - to.getTime() < 60 * 1000
		? '<1 minute'
		: formatDistanceToNowStrict(to)

import { useDevice } from '@context/Device'
import { formatDistanceToNow } from 'date-fns'
import {
	ChevronLeft,
	ChevronRight,
	Cloud,
	CloudOff,
	Eye,
	EyeOff,
} from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'
import { styled } from 'styled-components'

const W = styled.div`
	color: white;
	padding: 1rem;
`

const NotConnected = styled(W)`
	background-color: #50481e;
`

const Connected = styled(W)`
	background-color: #2f501e;
`

export const WebsocketTerminal = () => {
	const { connected, messages } = useDevice()
	const [collapsed, setCollapsed] = useState<boolean>(true)
	const [index, setIndex] = useState<number>(messages.length - 1)
	const latestMessage = messages[index]

	console.log({ index })

	if (connected && latestMessage !== undefined) {
		const {
			ts,
			message: { payload, topic, '@context': context },
		} = latestMessage
		return (
			<>
				<Connected>
					<div class="d-flex justify-content-between align-items-center">
						<span>
							<Cloud />
						</span>
						<span>
							{!collapsed && messages.length > 1 && (
								<>
									<button
										type="button"
										class="btn btn-sm btn-secondary me-1"
										disabled={index === 0}
										onClick={() =>
											setIndex((i) => {
												const newIndex = i - 1
												if (newIndex < 0) return 0
												return newIndex
											})
										}
									>
										<ChevronLeft />
									</button>
									<button
										type="button"
										class="btn btn-sm btn-secondary me-3"
										disabled={index === messages.length - 1}
										onClick={() =>
											setIndex((i) => {
												const newIndex = i + 1
												if (newIndex > messages.length - 1)
													return messages.length - 1
												return newIndex
											})
										}
									>
										<ChevronRight />
									</button>
								</>
							)}
							<button
								type="button"
								class="btn btn-sm btn-secondary"
								onClick={() => setCollapsed((c) => !c)}
							>
								{collapsed ? <EyeOff /> : <Eye />}
							</button>
						</span>
					</div>
					{!collapsed && (
						<dl>
							<dt>Type</dt>
							<dd>
								<code>{context}</code>
							</dd>
							{topic !== undefined && (
								<>
									<dt>topic</dt>
									<dd>{topic}</dd>
								</>
							)}
							<dt>Payload</dt>
							<dd>
								<pre>{JSON.stringify(payload, null, 2)}</pre>
							</dd>
							<dt>Received</dt>
							<dd>
								<Ago date={ts} />
							</dd>
						</dl>
					)}
				</Connected>
			</>
		)
	}
	return (
		<>
			<NotConnected>
				<CloudOff />
			</NotConnected>
		</>
	)
}

const Ago = ({ date }: { date: Date }) => {
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

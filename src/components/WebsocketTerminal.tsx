import { useDevice } from '#context/Device.js'
import {
	ChevronLeft,
	ChevronRight,
	CloudLightning,
	CloudOff,
} from 'lucide-preact'
import { useState } from 'preact/hooks'
import { Ago } from './Ago.js'
import { Secondary } from './buttons/Button.js'

export const WebsocketTerminal = () => {
	const { connected, messages, device } = useDevice()
	const [index, setIndex] = useState<number>(Math.max(messages.length - 1, 0))
	const latestMessage = messages[index]

	if (connected && latestMessage !== undefined) {
		const {
			received: ts,
			message: { '@context': context, ...message },
		} = latestMessage
		return (
			<>
				<div style={{ backgroundColor: '#2f501e' }} class="text-white p-2">
					<div class="d-flex justify-content-between align-items-center">
						<span class="d-flex align-items-center">
							<CloudLightning />
							<span class="ms-2">div: {device?.id}</span>
						</span>
						<span>
							{messages.length > 1 && (
								<>
									<Secondary
										small
										class="me-1"
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
										<ChevronLeft />
									</Secondary>
									<Secondary
										small
										class="me-3"
										disabled={index === 0}
										onClick={() =>
											setIndex((i) => {
												const newIndex = i - 1
												if (newIndex < 0) return 0
												return newIndex
											})
										}
									>
										<ChevronRight />
									</Secondary>
								</>
							)}
						</span>
					</div>
					<dl>
						<dt>Context</dt>
						<dd>
							<code>{context}</code>
						</dd>
						<dt>Message</dt>
						<dd>
							<pre>{JSON.stringify(message, null, 2)}</pre>
						</dd>
						<dt>Received</dt>
						<dd>
							<Ago date={ts} />
						</dd>
					</dl>
					)
				</div>
			</>
		)
	}
	return (
		<div style={{ backgroundColor: '#50481e' }} class="text-white p-2">
			<CloudOff />
		</div>
	)
}

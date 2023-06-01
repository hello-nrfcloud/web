import { useDevice } from '@context/Device'
import {
	ChevronLeft,
	ChevronRight,
	Cloud,
	CloudOff,
	Eye,
	EyeOff,
} from 'lucide-preact'
import { useState } from 'preact/hooks'
import { styled } from 'styled-components'
import { Ago } from './Ago.js'
import { SecondaryButton } from './StyleGuide.js'

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
	const { connected, messages, device } = useDevice()
	const [collapsed, setCollapsed] = useState<boolean>(true)
	const [index, setIndex] = useState<number>(Math.max(messages.length - 1, 0))
	const latestMessage = messages[index]

	if (connected && latestMessage !== undefined) {
		const {
			received: ts,
			message: { '@context': context, ...message },
		} = latestMessage
		return (
			<>
				<Connected>
					<div class="d-flex justify-content-between align-items-center">
						<span class="d-flex align-items-center">
							<Cloud />
							<span class="ms-2">Connected: {device?.imei}</span>
						</span>
						<span>
							{!collapsed && messages.length > 1 && (
								<>
									<SecondaryButton
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
									</SecondaryButton>
									<SecondaryButton
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
									</SecondaryButton>
								</>
							)}
							<SecondaryButton small onClick={() => setCollapsed((c) => !c)}>
								{collapsed ? <EyeOff /> : <Eye />}
							</SecondaryButton>
						</span>
					</div>
					{!collapsed && (
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

import { useDevice } from '@context/Device'
import { Cloud, CloudOff } from 'lucide-preact'
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
	if (connected) {
		return (
			<>
				<Connected>
					<Cloud /> {JSON.stringify(messages[0])}
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

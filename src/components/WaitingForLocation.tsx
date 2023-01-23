import { CloudOff } from 'lucide-preact'
import styled from 'styled-components'

const Placeholder = styled.div`
	aspect-ratio: 2/1;
	background: url(/static/images/map-no-data.png);
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
	background-color: #353636;
	color: white;
	display: flex;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	svg {
		width: 128px;
		height: 128px;
		animation: pulse 2s infinite;
	}
	@keyframes pulse {
		0% {
			opacity: 0.25;
			scale: 0.9;
		}

		50% {
			opacity: 1;
			scale: 1;
		}

		100% {
			opacity: 0.25;
			scale: 0.9;
		}
	}
`
export const WaitingForLocation = () => (
	<Placeholder>
		<CloudOff />
		<p>Waiting for connection ...</p>
	</Placeholder>
)

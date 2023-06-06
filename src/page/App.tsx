import { AboutHeader } from '@components/AboutHeader'
import { ConnectDK } from '@components/ConnectDK'
import { DKResources } from '@components/DKResources'
import { DKSelector } from '@components/DKSelector'
import { Footer } from '@components/Footer'
import { Navbar } from '@components/Navbar'
import { SelectedDK } from '@components/SelectedDK'
import { WebsocketTerminal } from '@components/WebsocketTerminal'
import { useFingerprint } from '@context/Code'
import { useDevice } from '@context/Device'
import { DeviceFlow } from '@flows/DeviceFlow'
import { Map } from '@map/Map'

export const App = () => {
	const { type, device } = useDevice()
	const { fingerprint } = useFingerprint()
	return (
		<>
			<Navbar />
			<AboutHeader />
			<WebsocketTerminal />
			<main>
				<article>
					<div style={{ backgroundColor: '#eee' }} class="pt-4 pb-4">
						<div class="container">
							{fingerprint !== null && device === undefined && <ConnectDK />}
							{type !== undefined && <SelectedDK selected={type} />}
							{fingerprint === null && type === undefined && <DKSelector />}
						</div>
					</div>
					{device !== undefined && type !== undefined && (
						<>
							<DeviceFlow type={type} device={device} />
							<Map />
						</>
					)}
					{type !== undefined && <DKResources type={type} />}
					<Footer />
				</article>
			</main>
		</>
	)
}

import { DKResources } from '@components/DKResources'
import { DKSelector } from '@components/DKSelector'
import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { LeveledResources } from '@components/LeveledResources'
import { PreviewWarning } from '@components/PreviewWarning'
import { SelectedDK } from '@components/SelectedDK'
import { WebsocketTerminal } from '@components/WebsocketTerminal'
import { useDevice } from '@context/Device'
import { DeviceFlow } from '@flows/DeviceFlow'

export const App = () => {
	const { type, device } = useDevice()

	return (
		<>
			<PreviewWarning />
			<WebsocketTerminal />
			<main>
				<article>
					<Header />
					<div style={{ backgroundColor: '#eee' }} class="pt-4 pb-4">
						<div class="container">
							{type !== undefined && <SelectedDK selected={type} />}
							{type === undefined && <DKSelector />}
						</div>
					</div>
					{device !== undefined && type !== undefined && (
						<DeviceFlow type={type} device={device} />
					)}
					{type !== undefined && <DKResources type={type} />}
					<LeveledResources dk={type} />
					<Footer />
				</article>
			</main>
		</>
	)
}

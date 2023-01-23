import { Map } from '@components/Map'
import { WaitingForLocation } from '@components/WaitingForLocation'
import { Warning } from '@components/Warning'
import { useSettings } from '@context/Settings'
import { SelectDK } from '@flow/SelectDK'

export const App = () => {
	const {
		settings: { dkCredentials },
	} = useSettings()
	return (
		<>
			<main>
				<div class="container">
					<Warning title="Development preview: this project is under development and not ready to use." />
				</div>
				<article>
					<header class="container pt-4 pb-4">
						<h1>nRF Guide</h1>
						<p>
							Welcome to <em>nRF Guide</em> your getting started guide for the
							Nordic Semiconductor Development Kits.
						</p>
					</header>
					<div style={{ backgroundColor: '#eee' }} class="pt-4 pb-4">
						<div class="container">
							<SelectDK />
						</div>
					</div>
					{dkCredentials === undefined && <WaitingForLocation />}
					{dkCredentials !== undefined && (
						<>
							<Map />
							<div
								style={{
									backgroundColor: '#01509b',
									backgroundImage: 'url(/static/images/cross.webp)',
								}}
								class="pt-4 pb-4"
							>
								<div class="container pt-4 pb-4 text-light d-flex flex-row">
									<section>
										<h2>Congratulations!</h2>
										<p>You have successfully connected your development kit!</p>
										<p>
											If you share your kit's location with the world, you'll
											have the chance to win one of 10 Nordic IoTees every
											month!
										</p>
										<p>
											<button type="button" class="btn btn-success">
												Share my location!
											</button>
										</p>
									</section>
									<aside class="flex-shrink-1">
										<img
											src="/static/images/iotee.webp"
											alt="IoTee!"
											class="img-fluid"
										/>
									</aside>
								</div>
							</div>
						</>
					)}
				</article>
			</main>
		</>
	)
}

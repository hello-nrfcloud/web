import { AboutHeader } from '@components/AboutHeader'
import { DKSelector } from '@components/DKSelector'
import { ScanQR } from '@components/ScanQR'

export const Home = () => (
	<>
		<AboutHeader />
		<main>
			<article>
				<div style={{ backgroundColor: '#eee' }} class="pt-4 pb-4">
					<div class="container">
						<div class="row">
							<div class="col-12">
								<h2>Please scan the QR code on your DK</h2>
							</div>
						</div>
						<ScanQR />
						<div class="row">
							<div class="col-12">
								<h2 class="mt-4">... or select your hardware</h2>
							</div>
						</div>
						<DKSelector />
					</div>
				</div>
			</article>
		</main>
	</>
)

import type { Model } from '#context/Models.js'
import { FingerprintForm } from './FingerprintForm.js'
import { QRCodeScanner } from './QRCodeScanner.js'
import { WithResize } from './ResizeObserver.js'
import { ThingyWithQRCode } from './ThingyWithQRCode.js'

export const ScanQR = ({ type }: { type?: Model }) => (
	<div class="bg-light">
		<div class="container py-4">
			<div class="row mt-4">
				<h1>
					Scan the QR code to get real-time data from your personal device
				</h1>
			</div>
			<div class="row mt-4">
				<div class="col-12 col-md-6 col-lg-4 mb-4">
					{type !== undefined && (
						<img
							alt={`${type.title} (${type.name}) with QR code`}
							src={`/static/images/${encodeURIComponent(
								type.name,
							)}-QR.webp?v=${VERSION}`}
							class="img-fluid p-4"
						/>
					)}
					{type === undefined && (
						<WithResize>
							{(size) => <ThingyWithQRCode size={size} />}
						</WithResize>
					)}
				</div>
				<div class="col-12 col-md-6 col-lg-4">
					<QRCodeScanner />
				</div>
				<div class="col-12 col-md-12 col-lg-4">
					<h2>No QR code or camera?</h2>
					<p>Enter the fingerprint manually:</p>
					<FingerprintForm />
				</div>
			</div>
		</div>
	</div>
)

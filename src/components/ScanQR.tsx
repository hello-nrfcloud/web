import type { DK } from '#context/DKs.js'
import { FingerprintForm } from './FingerprintForm.js'
import { QRCodeScanner } from './QRCodeScanner.js'
import { ThingyWithQRCode } from './ThingyWithQRCode.js'

export const ScanQR = ({ type }: { type?: DK }) => (
	<div style={{ background: 'var(--color-nordic-light-grey)' }}>
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
							alt={`${type.title} (${type.model}) with QR code`}
							src={`/static/images/${encodeURIComponent(
								type.model,
							)}-QR.webp?v=${VERSION}`}
							class="img-fluid p-4"
						/>
					)}
					{type === undefined && <ThingyWithQRCode />}
				</div>
				<div class="col-12 col-md-6 col-lg-4">
					<QRCodeScanner />
				</div>
				<div class="col-12 col-md-12 col-lg-4">
					<h3>No QR code or camera?</h3>
					<p>Enter the fingerprint manually:</p>
					<FingerprintForm />
				</div>
			</div>
		</div>
	</div>
)

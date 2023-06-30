import { FingerprintForm } from './FingerprintForm.js'
import { QRCodeScanner } from './QRCodeScanner.js'
import { ThingyWithQRCode } from './ThingyWithQRCode.js'

export const ScanQR = () => (
	<div style={{ background: 'var(--color-nordic-light-grey)' }}>
		<div class="container py-4">
			<div class="row mt-4">
				<h1>
					Scan the QR code to get real-time data from your personal device
				</h1>
			</div>
			<div class="row mt-4">
				<div class="col-12 col-md-6 col-lg-4 mb-4">
					<ThingyWithQRCode />
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

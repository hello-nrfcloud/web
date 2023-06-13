import { FingerprintForm } from './FingerprintForm.js'
import { QRCodeScanner } from './QRCodeScanner.js'

export const ScanQR = () => (
	<>
		<div class="row mt-4">
			<div class="col-12 col-md-4 mb-4">
				<img
					src="/static/images/qrcode.webp?v=2"
					class="img-fluid"
					alt="Development Kit with QR code"
					width={744}
					height={629}
				/>
			</div>
			<div class="col-12 col-md-4">
				<QRCodeScanner />
			</div>
			<div class="col-12 col-md-4">
				<h3>No QR code or camera?</h3>
				<p>Enter the fingerprint manually:</p>
				<FingerprintForm />
			</div>
		</div>
	</>
)

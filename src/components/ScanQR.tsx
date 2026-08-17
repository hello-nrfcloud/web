import { FingerprintForm } from '#components/FingerprintForm.tsx'
import { QRCodeScanner } from '#components/QRCodeScanner.tsx'
import { WithResize } from '#components/ResizeObserver.tsx'
import { ThingyWithQRCode } from '#components/ThingyWithQRCode.tsx'

export const ScanQR = () => (
	<div class="bg-light">
		<div class="container py-4">
			<div class="row mt-4">
				<h1>
					Scan the QR code to get real-time data from your personal device
				</h1>
			</div>
			<div class="row mt-4">
				<div class="col-12 col-md-6 col-lg-4 mb-4">
					<WithResize>{(size) => <ThingyWithQRCode size={size} />}</WithResize>
				</div>
				<div class="col-12 col-md-6 col-lg-4 mb-3">
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

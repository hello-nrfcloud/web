import { FingerprintForm } from '#components/FingerprintForm.js'
import { QRCodeScanner } from '#components/QRCodeScanner.js'
import { WithResize } from '#components/ResizeObserver.js'
import { ThingyWithQRCode } from '#components/ThingyWithQRCode.js'
import { type Model } from '#content/models/types.js'

export const ScanQR = ({ model }: { model?: Model }) => (
	<div class="bg-light">
		<div class="container py-4">
			<div class="row mt-4">
				<h1>
					Scan the QR code to get real-time data from your personal device
				</h1>
			</div>
			<div class="row mt-4">
				<div class="col-12 col-md-6 col-lg-4 mb-4">
					{model !== undefined && (
						<img
							alt={`${model.title} (${model.slug}) with QR code`}
							src={`/static/images/${encodeURIComponent(
								model.slug,
							)}-QR.webp?v=${VERSION}`}
							class="img-fluid p-4"
						/>
					)}
					{model === undefined && (
						<WithResize>
							{(size) => <ThingyWithQRCode size={size} />}
						</WithResize>
					)}
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

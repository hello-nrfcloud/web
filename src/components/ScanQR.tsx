import { useDevice } from '#context/Device.js'
import { isFingerprint } from '#utils/isFingerprint.js'
import { useState } from 'preact/hooks'
import { QRCodeScanner } from './QRCodeScanner.js'
import { Secondary } from './buttons/Button.js'

export const ScanQR = () => {
	const [productionRun, setProductionRun] = useState<string>('42')
	const [token, setToken] = useState<string>('d3c4fb')
	const fingerprint = `${productionRun}.${token}`
	const isValid = isFingerprint(fingerprint)
	const { fromFingerprint: fromFingerprint } = useDevice()

	return (
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
					<h3>No QR code?</h3>
					<p>Enter the fingerprint manually:</p>
					<form class="row row-cols-lg-auto g-3 align-items-center">
						<div class="col-12">
							<label class="visually-hidden" htmlFor="productionRunInput">
								Fingerprint
							</label>
							<div class="input-group">
								<div class="input-group-text">{DOMAIN_NAME}/</div>
								<input
									type="text"
									minLength={1}
									class="form-control form-control-sm"
									id="productionRunInput"
									placeholder="42"
									value={productionRun}
									onChange={(e) => {
										setProductionRun((e.target as HTMLInputElement).value)
									}}
									size={2}
								/>
								<div class="input-group-text">.</div>
								<input
									type="text"
									minLength={6}
									maxLength={6}
									class="form-control form-control-sm"
									id="tokenInput"
									placeholder="d3c4fb"
									value={token}
									onChange={(e) => {
										setToken((e.target as HTMLInputElement).value)
									}}
									size={6}
								/>
							</div>
						</div>
						<div class="col-12">
							<Secondary
								disabled={!isValid}
								onClick={() => {
									fromFingerprint(fingerprint)
								}}
							>
								Submit
							</Secondary>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

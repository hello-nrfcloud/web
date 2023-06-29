import { generateCode } from '#page/ViewSource.js'
import { isFingerprint } from '@hello.nrfcloud.com/proto/fingerprint'
import { format } from 'date-fns'
import { useEffect, useState } from 'preact/hooks'
import QRCode from 'qrcode'

export const QRCodeGenerator = () => {
	const [year, setYear] = useState<string>('2023')
	const [week, setWeek] = useState<string>(format(new Date(), 'w'))
	const [token, setToken] = useState<string>(generateCode())
	const fingerprint = `${parseInt(
		`${parseInt(year, 10) - 2000}${parseInt(week, 10)}`,
		10,
	).toString(16)}.${token}`
	const isValid = isFingerprint(fingerprint)

	const url = isValid
		? new URL(`https://${DOMAIN_NAME}/${fingerprint}`)
		: undefined

	return (
		<section>
			<form class="row">
				<div class="col-4">{url !== undefined && <QrCode url={url} />}</div>
				<div class="col-8">
					<div class="mb-2">
						<label>
							Year
							<input
								type="number"
								min={2023}
								class="form-control"
								id="yearInput"
								placeholder="e.g. '2023'"
								step={1}
								value={year}
								onChange={(e) => {
									setYear((e.target as HTMLInputElement).value)
								}}
							/>
						</label>
					</div>
					<div class="mb-2">
						<label>
							Week
							<input
								type="number"
								min={1}
								max={53}
								class="form-control"
								id="weekInput"
								placeholder="e.g. '17'"
								step={1}
								value={week}
								onChange={(e) => {
									setWeek((e.target as HTMLInputElement).value)
								}}
							/>
						</label>
					</div>
					<div class="mb-2">
						<label>
							Unique token:
							<input
								type="text"
								minLength={6}
								maxLength={6}
								class="form-control"
								id="tokenInput"
								placeholder="e.g. 'd3c4fb'"
								value={token}
								onChange={(e) => {
									setToken((e.target as HTMLInputElement).value)
								}}
							/>
						</label>
					</div>
				</div>
			</form>
			{url !== undefined && (
				<p>
					<a href={url.toString()} target="_blank">
						<code>{url.toString()}</code>
					</a>
				</p>
			)}
			<p class="mt-3">
				The QR code encodes a link with a fingerprint (e.g.{' '}
				<code>92b.d3c4fb</code>) that contains the production run number (e.g.{' '}
				<code>2347</code>) and a unique token (e.g. <code>d3c4fb</code>) that
				will prove a user's ownership of the kit and will be used to look up the
				device information in our database.
			</p>
			<p class="mt-3">
				The production run number is an integer created by combining the last
				two digits of the year and the week number. This way the generated
				fingerprint can be short and does not have to be globally unique. During
				production runs, uniqueness check only needs to be done locally.
			</p>
			<p>
				In the fingerprint, the production run number is HEX encoded to reduce
				the number of characters in the fingerprint.
			</p>
		</section>
	)
}

const QrCode = ({ url }: { url: URL }) => {
	const [imageData, setImageData] = useState<string>()
	useEffect(() => {
		QRCode.toDataURL(url.toString(), {
			type: 'image/png',
			errorCorrectionLevel: 'L',
			version: 3,
			margin: 0,
			scale: 10,
		})
			.then((dataUrl) => {
				setImageData(dataUrl)
			})
			.catch((err) => console.error(`[QRCode]`, err))
	}, [url])

	if (imageData === undefined) return null
	return (
		<img src={imageData} alt={`QR Code for ${url.toString()}`} class="w-100" />
	)
}

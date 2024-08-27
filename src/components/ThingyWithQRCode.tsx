import type { Size } from '#components/ResizeObserver.js'
import { generateFingerprint } from '#utils/generateFingerprint.js'
import { generateIMEI } from '#utils/generateIMEI.js'
import code128 from 'code-128-encoder'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'preact/hooks'
import QRCode from 'qrcode'

const encoder = new code128()

export const ThingyWithQRCode = ({ size }: { size?: Size }) => {
	const ref = useRef<HTMLImageElement>(null)
	const [fingerprint] = useState<string>(generateFingerprint())
	const [qrcodeSVG, setSVG] = useState<string>()

	const scale = (size?.width ?? 100) / 100
	const p = (pos: number) => pos * scale

	const imei = generateIMEI()

	const url = `https://hello.nrfcloud.com/${fingerprint}`

	useEffect(() => {
		QRCode.toString(url.toString(), {
			type: 'svg',
			errorCorrectionLevel: 'L',
			version: 3,
			margin: 0,
			scale: 10,
		})
			.then((svg) => {
				setSVG(svg)
			})
			.catch((err) => console.error(`[QRCode]`, err))
	}, [fingerprint])

	return (
		<section style={{ position: 'relative' }}>
			<div>
				<img
					src="/static/images/PCA20065-QR.webp"
					ref={ref}
					class="img-fluid"
					alt="Thingy:91 X"
				/>
			</div>
			<svg
				version="1.1"
				width={p(100)}
				height={p(100)}
				viewBox={`0 0 ${p(100)} ${p(100)}`}
				xmlns="http://www.w3.org/2000/svg"
				style={{ position: 'absolute', top: '0', left: '0' }}
				fontSize={p(2.5)}
				fontFamily={"'IBM Plex Mono', monospace"}
			>
				<g transform={`translate(${p(22)},${p(20)})`}>
					<rect
						x={p(0)}
						y={p(0)}
						width={p(63)}
						height={p(18)}
						rx={p(2.5)}
						fill={'#ffffff'}
					/>
					<text x={p(13)} y={p(10.5)} fontWeight={700}>
						IMEI:{imei}
					</text>
					<text
						x={p(20)}
						y={p(8)}
						fontFamily={"'Libre Barcode 128', 'cursive'"}
						fontSize={p(12)}
						dangerouslySetInnerHTML={{
							__html: encoder.encode(imei),
						}}
						transform="scale(0.65 1)"
					></text>
					<text x={p(1)} y={p(3)} fontWeight={700}>
						PCA2065
					</text>
					<text x={p(1)} y={p(5.5)}>
						1.0.0
					</text>
					<text x={p(1)} y={p(8)}>
						{format(new Date(), 'yyyy.w')}
					</text>
					<text x={p(1)} y={p(15.5)}>
						{url.toString().slice(8)}
					</text>
				</g>
			</svg>
			{qrcodeSVG !== undefined && (
				<div
					dangerouslySetInnerHTML={{
						__html: qrcodeSVG,
					}}
					style={{
						position: 'absolute',
						top: p(21),
						left: p(68),
						width: p(16),
						height: p(16),
					}}
				></div>
			)}
		</section>
	)
}

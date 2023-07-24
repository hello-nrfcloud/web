import { generateCode, generateIMEI } from '#page/ViewSource.js'
import code128 from 'code-128-encoder'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'preact/hooks'
import QRCode from 'qrcode'
import type { Size } from './ResizeObserver.js'

const encoder = new code128()

export const ThingyWithQRCode = ({ size }: { size?: Size }) => {
	const ref = useRef<HTMLImageElement>(null)
	const [fingerprint] = useState<string>(
		`${parseInt(`${format(new Date(), 'yyw')}`, 10).toString(
			16,
		)}.${generateCode()}`,
	)
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
					src="/static/images/NordicThingy91.webp"
					ref={ref}
					class="img-fluid"
					alt="Thingy:91"
				/>
			</div>
			<svg
				version="1.1"
				width={p(100)}
				height={p(100)}
				viewBox={`0 0 ${p(100)} ${p(100)}`}
				xmlns="http://www.w3.org/2000/svg"
				style={{ position: 'absolute', top: '0', left: '0' }}
				fontSize={p(1.8)}
				fontFamily={"'IBM Plex Mono', monospace"}
			>
				<rect
					x={p(23.5)}
					y={p(27.5)}
					width={p(45)}
					height={p(10)}
					rx={p(1)}
					fill={'#ffffff'}
				/>
				<text x={p(33)} y={p(34)}>
					IMEI:{imei}
				</text>
				<text
					x={p(33)}
					y={p(32)}
					fontFamily={"'Libre Barcode 128', 'cursive'"}
					fontSize={p(6)}
					dangerouslySetInnerHTML={{
						__html: encoder.encode(imei),
					}}
				></text>
				<text x={p(24.5)} y={p(30)} fontWeight={700}>
					PCA2035
				</text>
				<text x={p(24.5)} y={p(32)}>
					1.0.0
				</text>
				<text x={p(24.5)} y={p(34)}>
					{format(new Date(), 'yyyy.w')}
				</text>
				<text x={p(24.5)} y={p(36)}>
					{url.toString().slice(8)}
				</text>
			</svg>
			{qrcodeSVG !== undefined && (
				<div
					dangerouslySetInnerHTML={{
						__html: qrcodeSVG,
					}}
					style={{
						position: 'absolute',
						top: p(28),
						left: p(59),
						width: p(9),
						height: p(9),
					}}
				></div>
			)}
		</section>
	)
}

import { isCode } from '@utils/isCode'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { QrCode } from 'lucide-preact'
import { useEffect, useId, useState } from 'preact/hooks'

type Camera = { id: string; label: string }

export const QRCodeScanner = () => {
	const containerId = useId()
	const [state, setState] = useState<
		'idle' | 'waiting_for_cameras' | 'scanning' | 'no_cameras_found'
	>('idle')
	const [cameras, setCameras] = useState<Camera[]>([])
	const [currentCamera, setCurrentCamera] = useState<Camera | undefined>(
		cameras[0],
	)
	const [viewFinderSize, setViewFinderSize] = useState<[number, number]>([
		500, 300,
	])
	const [foundURL, setFoundURL] = useState<URL | undefined>()

	useEffect(() => {
		if (currentCamera === undefined) return
		let stopped = false
		const html5QRCode = new Html5Qrcode(containerId, {
			formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
			verbose: true,
		})
		html5QRCode
			.start(
				currentCamera.id,
				{
					fps: 1,
					qrbox: (viewfinderWidth, viewfinderHeight) => {
						setViewFinderSize([viewfinderWidth, viewfinderHeight])
						const m = Math.floor(
							Math.min(viewfinderHeight, viewfinderWidth) * 0.5,
						)
						return {
							width: m,
							height: m,
						}
					},
				},
				(decodedText) => {
					try {
						const u = new URL(decodedText)
						if (u.hostname === 'nrf.guide' && isCode(u.pathname.slice(1))) {
							setFoundURL(u)
							console.log(`[QR code]`, `Found URL`, u)
							stopped = true
							html5QRCode.stop().catch((err) => {
								console.error(`[QR Code]`, `Failed to stop`, err)
							})
							setState('idle')
						}
					} catch {
						console.error(`[QR code]`, `Not a URL`, decodedText)
					}
				},
				(errorMessage) => {
					console.warn(`[QR code]`, errorMessage)
				},
			)
			.catch((err) => {
				console.error(`[QR Code]`, `Failed to start`, err)
			})

		return () => {
			if (!stopped)
				html5QRCode.stop().catch((err) => {
					console.error(`[QR Code]`, `Failed to stop`, err)
				})
		}
	}, [currentCamera])

	useEffect(() => {
		if (foundURL === undefined) return
		document.location.href = foundURL.toString()
	}, [foundURL])

	return (
		<>
			<p>
				The QR code on the Development Kit encodes a link with a code (e.g.{' '}
				<code>42.d3c4fb4d</code>) that contains the production run ID (e.g.{' '}
				<code>42</code>) and a unique code (e.g. <code>d3c4fb4d</code>) that
				will prove your ownership of the DK and will be used to look up the IMEI
				in our database.
			</p>
			<p>
				<button
					class="btn btn-primary"
					type="button"
					onClick={async () => {
						setState('waiting_for_cameras')
						try {
							const cameras = await Html5Qrcode.getCameras()
							console.log(cameras)
							if (cameras.length > 0) {
								setState('scanning')
								setCameras(cameras)
								setCurrentCamera(cameras[0])
							} else {
								setState('no_cameras_found')
							}
						} catch (err) {
							console.error(err)
							setState('no_cameras_found')
						}
					}}
				>
					<QrCode /> Scan QR code
				</button>
			</p>
			{foundURL !== undefined && (
				<p>
					Found URL: <a href={foundURL.toString()}>{foundURL.toString()}</a>
				</p>
			)}
			{state === 'waiting_for_cameras' && (
				<p>
					<em>Requesting camera access.</em>
				</p>
			)}
			{state === 'scanning' && cameras.length > 1 && (
				<>
					<select
						value={currentCamera?.id}
						onChange={(e) => {
							setCurrentCamera(
								cameras.find(
									({ id }) => id === (e.target as HTMLSelectElement).value,
								),
							)
						}}
					>
						{cameras.map((camera) => (
							<option value={camera.id}>{camera.label}</option>
						))}
					</select>{' '}
					<div
						id={containerId}
						style={{
							width: `${viewFinderSize[0]}px`,
							height: `${viewFinderSize[1]}px`,
						}}
						class="mt-4"
					/>
				</>
			)}
		</>
	)
}

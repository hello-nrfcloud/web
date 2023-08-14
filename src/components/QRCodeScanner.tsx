import { isFingerprint } from '@hello.nrfcloud.com/proto/fingerprint'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { QrCode } from 'lucide-preact'
import { useEffect, useId, useState } from 'preact/hooks'
import { Primary } from './buttons/Button.js'

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
	const [foundURL, setFoundURL] = useState<URL | undefined>()
	const [hasVideo, setHasVideo] = useState(false)

	// Detect video devicesa
	useEffect(() => {
		if (navigator.mediaDevices?.enumerateDevices === undefined) {
			console.debug('[DetectVideo]', 'enumerateDevices() not supported.')
			return
		}

		// List cameras and microphones.
		navigator.mediaDevices
			.enumerateDevices()
			.then((devices) => {
				if (devices.find(({ kind }) => kind === 'videoinput') !== undefined) {
					setHasVideo(true)
				}
			})
			.catch((err) => {
				console.error('[DetectVideo]', `${err.name}: ${err.message}`)
			})
	}, [])

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
						const m = Math.floor(
							Math.min(viewfinderHeight, viewfinderWidth) * 0.66,
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
						if (
							u.hostname === DOMAIN_NAME &&
							isFingerprint(u.pathname.slice(1))
						) {
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
		const t = setTimeout(() => {
			document.location.href = foundURL.toString()
		}, 1000)
		return () => {
			clearTimeout(t)
		}
	}, [foundURL])

	return (
		<section>
			<p>
				The QR code on the device encodes a link with a fingerprint (e.g.{' '}
				<code>92b.d3c4fb</code>) that contains the production run number (e.g.{' '}
				<code>92b</code>) and a unique token (e.g. <code>d3c4fb</code>) that
				will prove your ownership of the device and will be used to look up the
				IMEI in our database.
			</p>
			<p>
				<Primary
					disabled={!hasVideo}
					onClick={async () => {
						setFoundURL(undefined)
						setState('waiting_for_cameras')
						try {
							const cameras = await Html5Qrcode.getCameras()
							if (cameras.length > 0) {
								setCurrentCamera(cameras[0])
								setCameras(cameras)
								setState('scanning')
							} else {
								setState('no_cameras_found')
							}
						} catch (err) {
							console.error(`[QR Code]`, err)
							setState('no_cameras_found')
						}
					}}
				>
					<QrCode /> Scan QR code
				</Primary>
				{!hasVideo && (
					<>
						<br />
						<small class="text-muted">No camera detected.</small>
					</>
				)}
			</p>
			{foundURL !== undefined && (
				<p>
					Found URL:{' '}
					<a href={foundURL.toString()} data-testid="qr-code-scan">
						{foundURL.toString()}
					</a>
				</p>
			)}
			{state === 'waiting_for_cameras' && (
				<p>
					<em>Requesting camera access.</em>
				</p>
			)}
			{state === 'scanning' && cameras.length > 1 && (
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
				</select>
			)}
			{state === 'scanning' && foundURL === undefined && (
				<div
					data-testid="camera-view"
					id={containerId}
					style={{
						width: `100%`,
						height: `auto`,
						aspectRatio: '3/2',
					}}
					class="mt-4"
				/>
			)}
		</section>
	)
}

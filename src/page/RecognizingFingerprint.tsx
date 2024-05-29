import { Transparent } from '#components/Buttons.js'
import { FingerprintForm } from '#components/FingerprintForm.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { useDevice } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { Trash } from 'lucide-preact'
import { useEffect } from 'preact/hooks'

export const RecognizingFingerprint = () => {
	const { fingerprint, clear } = useFingerprint()
	const { connectionFailed, device, connected } = useDevice()
	useEffect(() => {
		if (!device) return
		const t = setTimeout(() => {
			document.location.assign(`/device`)
		}, 1000)

		return () => {
			clearTimeout(t)
		}
	}, [device])

	return (
		<main class="container py-4">
			<div class="row py-4">
				<div class="col-12">
					<h1 class="mb-4 d-flex align-items-center justify-content-between">
						<span>
							Fingerprint: <code>{fingerprint}</code>
						</span>
						<Transparent
							onClick={() => clear()}
							class="text-muted fs-6 d-flex align-items-center"
						>
							<Trash size={25} strokeWidth={1} class="me-1" /> clear
						</Transparent>
					</h1>
					{!connected && !connectionFailed && <WaitingForDevice />}
					{connected && !device && <WaitingForDevice />}
					{connectionFailed && (
						<>
							<h3>Connection failed.</h3>
							<p>
								The fingerprint you have provided is not recognized, and we were
								unable to identify the device it belongs to.
							</p>
							<p>Please double check that it is correct and try again.</p>
							<FingerprintForm />
							<p class="mt-4">
								If you keep having trouble, please{' '}
								<a
									href="https://devzone.nordicsemi.com/support/add"
									target="_blank"
								>
									contact our support
								</a>
								.
							</p>
						</>
					)}
					{connected && device !== undefined && (
						<>
							<h2>Connected!</h2>
							<p>
								We are taking you <a href={`/device`}>to your device</a>...
							</p>
						</>
					)}
				</div>
			</div>
		</main>
	)
}

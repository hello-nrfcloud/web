import { Feedback } from '#components/Feedback.js'
import { ModelResources } from '#components/ModelResources.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { Page as SolarThingy91 } from '#model/PCA20035-solar/Page.js'
import { Page as Thingy91X } from '#model/PCA20065/Page.js'
import { useDevice } from '#context/Device.js'
import { LwM2MDebug } from '#components/LwM2MDebug.js'
import cx from 'classnames'
import { Provider as FOTAProvider } from '#context/FOTA.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { WithParameters } from '#context/Parameters.js'

export const Device = () => {
	const { device, debug } = useDevice()
	const { fingerprint } = useFingerprint()

	if (device === undefined)
		return (
			<div class="container">
				<div class="row">
					<div class="col my-4">
						<WaitingForDevice />
					</div>
				</div>
			</div>
		)

	if (device.model === undefined) {
		return (
			<div class="container">
				<div class="row">
					<div class="col my-4">
						<h1>Unsupported model</h1>
						<p>
							The application does not support the model specified for this
							device (<code>{device.id}</code>).
						</p>
					</div>
				</div>
			</div>
		)
	}

	if (device.model.slug === 'unsupported') {
		return (
			<div class="container">
				<div class="row">
					<div
						class="col my-4"
						dangerouslySetInnerHTML={{
							__html: device.model.html,
						}}
					></div>
				</div>
			</div>
		)
	}

	return (
		<>
			<WithParameters>
				{({ helloApiURL }) => (
					<FOTAProvider
						device={device}
						fingerprint={fingerprint!}
						helloApiURL={helloApiURL}
					>
						<div class={cx({ hasSidebar: debug })}>
							{device.model.slug === 'PCA20035+solar' && (
								<SolarThingy91 device={device} />
							)}
							{device.model.slug === 'PCA20065' && (
								<Thingy91X device={device} />
							)}
							{debug && <LwM2MDebug />}
						</div>
					</FOTAProvider>
				)}
			</WithParameters>
			<ModelResources type={device.model} />
			<Feedback />
		</>
	)
}

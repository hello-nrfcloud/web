import { Feedback } from '#components/Feedback.js'
import { LwM2MDebug } from '#components/LwM2MDebug.js'
import { ModelResources } from '#components/ModelResources.js'
import { UnsupportedDevice } from '#components/UnsupportedDevice.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { useDevice } from '#context/Device.js'
import { Provider as FOTAProvider } from '#context/FOTA.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { WithParameters } from '#context/Parameters.js'
import { Page as SolarThingy91 } from '#model/PCA20035-solar/Page.js'
import { Page as Thingy91X } from '#model/PCA20065/Page.js'
import cx from 'classnames'

export const Device = () => {
	const { device, debug, unsupported } = useDevice()
	const { fingerprint } = useFingerprint()

	if (unsupported !== undefined)
		return (
			<div class="container">
				<div class="row">
					<div class="col my-4">
						<UnsupportedDevice />
					</div>
				</div>
			</div>
		)

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

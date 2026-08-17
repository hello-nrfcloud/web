import { Feedback } from '#components/Feedback.tsx'
import { LwM2MDebug } from '#components/LwM2MDebug.tsx'
import { ModelResources } from '#components/ModelResources.tsx'
import { UnsupportedDevice } from '#components/UnsupportedDevice.tsx'
import { WaitingForDevice } from '#components/WaitingForDevice.tsx'
import { useDevice } from '#context/Device.tsx'
import { Provider as FOTAProvider } from '#context/FOTA.tsx'
import { useFingerprint } from '#context/Fingerprint.tsx'
import { WithParameters } from '#context/Parameters.tsx'
import { Page as Thingy91X } from '#model/PCA20065/Page.tsx'
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

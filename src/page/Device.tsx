import { Feedback } from '#components/Feedback.js'
import { ModelResources } from '#components/ModelResources.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { Page as SolarThingy91 } from '#model/PCA20035-solar/Page.js'
import { Page as Thingy91X } from '#model/PCA20065/Page.js'
import { useDevice } from '#context/Device.js'
import { LwM2MDebug } from '#components/LwM2MDebug.js'
import cx from 'classnames'

export const Device = () => {
	const { device, debug } = useDevice()

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

	if (device.model.name === 'unsupported') {
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
			<div class={cx({ hasSidebar: debug })}>
				{device.model.name === 'PCA20035+solar' && (
					<SolarThingy91 device={device} />
				)}
				{device.model.name === 'PCA20065' && <Thingy91X device={device} />}
				{debug && <LwM2MDebug />}
			</div>
			<ModelResources type={device.model} />
			<Feedback />
		</>
	)
}

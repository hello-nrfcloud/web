import { Feedback } from '#components/Feedback.js'
import { ModelResources } from '#components/ModelResources.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { SolarThingy91 } from '#components/device/SolarThingy91.js'
import { Thingy91X } from '#components/device/Thingy91X.js'
import { useDevice } from '#context/Device.js'

export const Device = () => {
	const { device } = useDevice()

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
			{device.model.name === 'PCA20035+solar' && (
				<SolarThingy91 device={device} />
			)}
			{device.model.name === 'PCA20065' && <Thingy91X device={device} />}
			<ModelResources type={device.model} />
			<Feedback />
		</>
	)
}

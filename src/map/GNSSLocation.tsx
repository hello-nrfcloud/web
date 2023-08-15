import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDevice, type Device } from '#context/Device.js'
import { useDeviceLocation } from '#context/DeviceLocation.js'
import { useDeviceState } from '#context/DeviceState.js'
import { Located } from '#map/Map.js'
import { ConfigureDevice, Context } from '@hello.nrfcloud.com/proto/hello'
import {
	LocationSource,
	Reported,
} from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import type { Static } from '@sinclair/typebox'
import { CheckCircle, ZapOffIcon } from 'lucide-preact'
import { useState } from 'preact/hooks'

export const GNSSLocation = ({ device }: { device: Device }) => {
	const { state } = useDeviceState()
	const { locations } = useDeviceLocation()
	const gnssLocation = locations[LocationSource.GNSS]
	const gnssEnabled = !(state?.config?.nod ?? ['gnss']).includes('gnss')

	return (
		<>
			<h2>GNSS location</h2>
			<p>
				The integrated GNSS received of the {device.model.title} can provide
				precise geo location, however this comes at a cost. While the receiver
				is listening for GNSS signals, the LTE modem has to be turned off. If
				the device is indoors acquiring a GNSS fix might not be possible, and
				block the modem unnecessary long.
			</p>
			<p>
				Depending on your use-case scenario you can control whether to enable
				GNSS on this device:
			</p>
			{state === undefined && (
				<LoadingIndicator light height={48} width={'100%'} />
			)}
			{state !== undefined && (
				<GNSSLocationConfig device={device} state={state} />
			)}
			{gnssEnabled && (
				<>
					{gnssLocation !== undefined && <Located location={gnssLocation} />}
					{gnssLocation === undefined && (
						<p>
							<LoadingIndicator light height={60} width={'100%'} />
						</p>
					)}
				</>
			)}
		</>
	)
}

const GNSSLocationConfig = ({
	device,
	state,
}: {
	device: Device
	state: Static<typeof Reported>
}) => {
	const reported = !(state.config?.nod ?? []).includes('gnss')
	const { send } = useDevice()
	const [desired, setDesired] = useState<boolean | undefined>(undefined)
	const applicationPending = desired !== undefined && reported !== desired
	const enableGNSS = (enabled: boolean) => {
		const configureDevice: Static<typeof ConfigureDevice> = {
			'@context': Context.configureDevice.toString(),
			id: device.id,
			configuration: {
				gnss: enabled,
			},
		}
		send?.(configureDevice)
		setDesired(enabled)
	}
	return (
		<>
			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name="gnssMode"
					id="gnssEnabled"
					checked={(desired ?? reported) === true}
					onClick={() => {
						enableGNSS(true)
					}}
				/>
				<label
					class="form-check-label d-flex align-items-center"
					for="gnssEnabled"
				>
					Enable GNSS
					{desired === true && <Applied applied={!applicationPending} />}
				</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name="gnssMode"
					id="gnssDisabled"
					checked={(desired ?? reported) === false}
					onClick={() => {
						enableGNSS(false)
					}}
				/>
				<label
					class="form-check-label d-flex align-items-center"
					for="gnssDisabled"
				>
					Disable GNSS
					{desired === false && <Applied applied={!applicationPending} />}
				</label>
			</div>
		</>
	)
}

const Applied = ({ applied }: { applied: boolean }) => {
	if (applied)
		return (
			<span>
				<CheckCircle strokeWidth={1} class="color-success ms-2" size={16} /> The
				device has applied the configuration change.
			</span>
		)
	return (
		<span>
			<ZapOffIcon strokeWidth={1} class="color-warning ms-2" size={16} /> The
			device has not yet applied the configuration change.
		</span>
	)
}

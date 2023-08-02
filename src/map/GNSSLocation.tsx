import { ZapOffIcon } from 'lucide-preact'
import { useDevice, type Device } from '#context/Device.js'
import { useDeviceState } from '#context/DeviceState.js'
import { ConfigureDevice, Context } from '@hello.nrfcloud.com/proto/hello'
import {
	LocationSource,
	Reported,
} from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import { useState } from 'preact/hooks'
import { SlidingSwitch } from '#components/buttons/SlidingSwitch.js'
import type { Static } from '@sinclair/typebox'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDeviceLocation } from '#context/DeviceLocation.js'
import { Located } from '#map/Map.js'

export const GNSSLocation = ({ device }: { device: Device }) => {
	const { state } = useDeviceState()
	const { locations } = useDeviceLocation()
	const gnssLocation = locations[LocationSource.GNSS]
	const gnssEnabled = !(state?.config?.nod ?? []).includes('gnss')

	return (
		<>
			<h2>GNSS location</h2>
			<p>
				The integrated GNSS received of the {device.type.title} can provide
				precise geo location, however this comes at a cost. While the receiver
				is listening for GNSS signals, the LTE modem has to be turned off. If
				the device is indoors acquiring a GNSS fix might not be possible, and
				block the modem unnecessary long.
			</p>
			<p>
				Depending on your use-case scenario you can control whether to enable
				GNSS on this device:
			</p>
			<div class="d-flex flex-row align-items-center mb-2">
				{state === undefined && (
					<>
						<LoadingIndicator height={40} width={74} class="me-2" />
						<LoadingIndicator height={20} width={120} class="ms-2" />
					</>
				)}
				{state !== undefined && (
					<GNSSLocationConfig device={device} state={state} />
				)}
			</div>
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
	return (
		<>
			<SlidingSwitch
				value={desired ?? reported}
				class="me-2"
				onChange={(state) => {
					const configureDevice: Static<typeof ConfigureDevice> = {
						'@context': Context.configureDevice.toString(),
						id: device.id,
						configuration: {
							gnss: state,
						},
					}
					send?.(configureDevice)
					setDesired(state)
				}}
			/>
			<div class="ms-2">
				{reported ? 'GNSS is enabled' : 'GNSS is disabled'}
			</div>
			{applicationPending && (
				<div
					style={{
						color: 'var(--color-nordic-sun)',
					}}
					class="ms-2"
				>
					<small>
						<ZapOffIcon strokeWidth={1} size={16} /> The device has not yet
						applied the configuration change.
					</small>
				</div>
			)}
		</>
	)
}

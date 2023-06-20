import type { DK } from '#context/DKs.js'
import { useDevice } from '#context/Device.js'
import { useDeviceState } from '#context/DeviceState.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { CloudLightning, CloudOff } from 'lucide-preact'
import { Secondary } from './buttons/Button.js'

export const SelectedDK = ({ selected }: { selected: DK }) => {
	const { device } = useDevice()
	const { clear } = useFingerprint()
	const { state } = useDeviceState()
	return (
		<div class="d-flex justify-content-between align-items-center">
			<span>
				<span class="me-1">
					{device === undefined && <CloudOff />}
					{device !== undefined && <CloudLightning />}
				</span>
				Your development kit: <strong>{selected.title}</strong> (
				{selected.model})
				<br />
				{device !== undefined && (
					<dl>
						{state?.device?.deviceInfo?.imei !== undefined && (
							<>
								<dt>IMEI</dt>
								<dd>{state.device.deviceInfo.imei}</dd>
							</>
						)}
					</dl>
				)}
			</span>
			<Secondary
				outline
				onClick={() => {
					clear()
				}}
			>
				clear
			</Secondary>
		</div>
	)
}

import type { DK } from '#context/DKs.js'
import { useDevice } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { CloudLightning, CloudOff } from 'lucide-preact'
import { Secondary } from './buttons/Button.js'

export const SelectedDK = ({ selected }: { selected: DK }) => {
	const { device } = useDevice()
	const { clear } = useFingerprint()
	return (
		<div class="d-flex justify-content-between align-items-center">
			<span>
				Your development kit: <strong>{selected.title}</strong> (
				{selected.model})
				<br />
				{device === undefined && (
					<span>
						<CloudOff />
						<span class="ms-2">No device credentials provided.</span>
					</span>
				)}
				{device !== undefined && (
					<span>
						<CloudLightning />
						<span class="ms-2">IMEI: {device.imei}</span>
					</span>
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

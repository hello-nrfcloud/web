import { DK, useDevice } from '@context/Device'
import { CloudLightning, CloudOff } from 'lucide-preact'
import { toTag } from './Tags'

export const SelectedDK = ({ selected }: { selected: DK }) => {
	const { device, clear } = useDevice()
	return (
		<div class="d-flex justify-content-between align-items-center">
			<span>
				Your development kit: <strong>{selected.title}</strong> (
				{selected.model}){selected.tags.map(toTag)}
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
			<button
				class={'btn btn-outline-secondary'}
				onClick={() => {
					clear()
				}}
			>
				clear
			</button>
		</div>
	)
}

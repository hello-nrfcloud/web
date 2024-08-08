import { QuickGlanceEntry } from '#components/quickGlance/QuickGlanceEntry.js'
import { useDevice } from '#context/Device.js'
import { CloudOffIcon } from 'lucide-preact'

export const WaitingForData = () => {
	const { lastSeen } = useDevice()
	return (
		<QuickGlanceEntry
			icon={CloudOffIcon}
			title="Live data missing"
			type="warning"
		>
			Waiting for data from your device
			<br />
			{lastSeen === undefined && (
				<small>The device has not yet connected to the cloud.</small>
			)}
			{lastSeen !== undefined && (
				<small>
					The device has not published data within the configured update
					interval.
				</small>
			)}
			<br />
			<small>
				Please make sure to follow{' '}
				<a href="#troubleshooting">the troubleshooting tips</a>.
			</small>
		</QuickGlanceEntry>
	)
}

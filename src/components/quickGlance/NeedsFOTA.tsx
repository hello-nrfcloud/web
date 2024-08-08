import { QuickGlanceEntry } from '#components/quickGlance/QuickGlanceEntry.js'
import { CloudDownloadIcon } from 'lucide-preact'

export const NeedsFOTA = () => (
	<QuickGlanceEntry
		icon={CloudDownloadIcon}
		title="FOTA"
		type="warning"
		action={{
			label: 'Schedule FOTA',
			href: '#fota',
		}}
	>
		Firmware update needed
		<br />
		<small>
			The firmware on your device is not up to date. You can schedule a FOTA in
			the section below.
		</small>
	</QuickGlanceEntry>
)

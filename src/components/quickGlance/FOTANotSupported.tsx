import { CloudDownloadIcon } from 'lucide-preact'
import { QuickGlanceEntry } from '#components/quickGlance/QuickGlanceEntry.js'

export const FOTANotSupported = () => (
	<QuickGlanceEntry icon={CloudDownloadIcon} title="FOTA" type="warning">
		Firmware update not supported
		<br />
		<small>
			The device does not support Firmware updates over the air (FOTA).
		</small>
	</QuickGlanceEntry>
)

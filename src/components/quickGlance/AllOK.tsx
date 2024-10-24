import { QuickGlanceEntry } from '#components/quickGlance/QuickGlanceEntry.js'
import { BadgeCheckIcon } from 'lucide-preact'

export const AllOK = () => (
	<QuickGlanceEntry icon={BadgeCheckIcon} title="OK" type="ok">
		Your device is working perfectly!
		<br />
		<small>We have detected no issues with your device.</small>
	</QuickGlanceEntry>
)

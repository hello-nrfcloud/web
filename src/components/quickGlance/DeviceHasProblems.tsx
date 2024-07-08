import { ChevronsDownIcon } from 'lucide-preact'
import { QuickGlanceEntry } from '#components/quickGlance/QuickGlanceEntry.js'

export const DeviceHasProblems = () => (
	<QuickGlanceEntry icon={ChevronsDownIcon} title="Not OK" type="notOk">
		We have detected problems with your device!
		<br />
		<small>
			Below are the issues with your device that may impact your ability to
			explore all of it's features.
		</small>
	</QuickGlanceEntry>
)

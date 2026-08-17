import { SIMIcon } from '#components/icons/SIMIcon.tsx'
import { QuickGlanceEntry } from '#components/quickGlance/QuickGlanceEntry.tsx'

export const SIMNoData = () => (
	<QuickGlanceEntry
		icon={({ size, class: className, title }) => (
			<SIMIcon class={className} size={size} title={title} />
		)}
		title="SIM"
		type="warning"
	>
		No data left on SIM
		<br />
		<small>
			The SIM in the device has little or no data left. You may need to top up
			the SIM. Contact your SIM provider for more information.
		</small>
	</QuickGlanceEntry>
)

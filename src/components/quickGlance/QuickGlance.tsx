import { useDevice } from '#context/Device.js'
import { useFOTA } from '#context/FOTA.js'
import {
	BadgeCheckIcon,
	CloudDownloadIcon,
	CloudOffIcon,
	TriangleAlertIcon,
} from 'lucide-preact'
import { QuickGlanceEntry } from './QuickGlanceEntry.js'

export const QuickGlance = () => {
	const { needsFwUpdate, needsMfwUpdate, fwTypes } = useFOTA()
	const { hasLiveData } = useDevice()
	const fotaSupported = fwTypes.length > 0
	const ok = !needsFwUpdate && !needsMfwUpdate && hasLiveData && fotaSupported
	return (
		<section id="quickGlance">
			{ok && (
				<QuickGlanceEntry icon={BadgeCheckIcon} title="OK" type="ok">
					Your device is working perfectly!
					<br />
					<small>We have detected no issues with your device.</small>
				</QuickGlanceEntry>
			)}
			{!ok && (
				<QuickGlanceEntry icon={TriangleAlertIcon} title="Not OK" type="notOk">
					We have detected problems with your device!
					<br />
					<small>
						There are some issues with your device that may impact your ability
						to explore all of it's features.
					</small>
				</QuickGlanceEntry>
			)}
			{!hasLiveData && (
				<QuickGlanceEntry
					icon={CloudOffIcon}
					title="Live data missing"
					type="warning"
				>
					Waiting for data from your device
					<br />
					<small>The device has not yet connected to the cloud.</small>
				</QuickGlanceEntry>
			)}
			{hasLiveData && (
				<>
					{(needsFwUpdate || needsMfwUpdate) && (
						<QuickGlanceEntry
							icon={CloudDownloadIcon}
							title="FOTA"
							type="warning"
							action={{
								label: 'Schedule FOTA',
								href: '#fota',
							}}
						>
							Firmware updated needed
							<br />
							<small>
								The firmware on your device is not up to date. You can schedule
								a FOTA in the section below.
							</small>
						</QuickGlanceEntry>
					)}
					{!fotaSupported && (
						<QuickGlanceEntry
							icon={CloudDownloadIcon}
							title="FOTA"
							type="warning"
						>
							Firmware updated not supported
							<br />
							<small>
								The device does not support Firmware updates over the air
								(FOTA).
							</small>
						</QuickGlanceEntry>
					)}
				</>
			)}
		</section>
	)
}

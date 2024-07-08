import { useDevice } from '#context/Device.js'
import { useFOTA } from '#context/FOTA.js'
import {
	BadgeCheckIcon,
	ChevronsDownIcon,
	CloudDownloadIcon,
	CloudOffIcon,
} from 'lucide-preact'
import { QuickGlanceEntry } from './QuickGlanceEntry.js'
import cx from 'classnames'

import './QuickGlance.css'
import { useSIMDetails } from '#context/SIMDetails.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'

export const QuickGlance = ({ class: className }: { class?: string }) => {
	const { needsFwUpdate, needsMfwUpdate, fwTypes } = useFOTA()
	const { hasLiveData, lastSeen } = useDevice()
	const { usage } = useSIMDetails()
	const fotaSupported = fwTypes.length > 0
	const noSIMData = usage !== undefined && usage.availablePercent < 0.01
	const ok =
		!needsFwUpdate &&
		!needsMfwUpdate &&
		hasLiveData &&
		fotaSupported &&
		!noSIMData
	return (
		<section
			id="quickGlance"
			class={cx(`QuickGlance`, className, {
				notOk: !ok,
				'mb-2': ok,
				'mb-4': !ok,
			})}
		>
			{ok && (
				<QuickGlanceEntry icon={BadgeCheckIcon} title="OK" type="ok">
					Your device is working perfectly!
					<br />
					<small>We have detected no issues with your device.</small>
				</QuickGlanceEntry>
			)}
			{!ok && (
				<QuickGlanceEntry icon={ChevronsDownIcon} title="Not OK" type="notOk">
					We have detected problems with your device!
					<br />
					<small>
						Below are the issues with your device that may impact your ability
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
							Firmware update needed
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
							Firmware update not supported
							<br />
							<small>
								The device does not support Firmware updates over the air
								(FOTA).
							</small>
						</QuickGlanceEntry>
					)}
				</>
			)}
			{noSIMData === true && (
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
						The SIM in the device has little or not data left. You may need to
						top up the SIM. Contact your SIM provider for more information.
					</small>
				</QuickGlanceEntry>
			)}
		</section>
	)
}

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

export const QuickGlance = ({ class: className }: { class?: string }) => {
	const { needsFwUpdate, needsMfwUpdate, fwTypes } = useFOTA()
	const { hasLiveData, lastSeen } = useDevice()
	const fotaSupported = fwTypes.length > 0
	const ok = !needsFwUpdate && !needsMfwUpdate && hasLiveData && fotaSupported
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
					<small>Please make sure to follow the troubleshooting tips.</small>
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
		</section>
	)
}

import { SecondaryLink } from '#components/Buttons.js'
import { useDevice } from '#context/Device.js'
import { useFOTA } from '#context/FOTA.js'
import {
	BadgeCheckIcon,
	CloudDownloadIcon,
	CloudOffIcon,
	TriangleAlertIcon,
	type LucideIcon,
} from 'lucide-preact'
import type { PropsWithChildren } from 'preact/compat'

export const QuickGlance = () => {
	const { needsFwUpdate, needsMfwUpdate, fwTypes } = useFOTA()
	const { hasLiveData } = useDevice()
	const fotaSupported = fwTypes.length > 0
	const ok = !needsFwUpdate && !needsMfwUpdate && hasLiveData && fotaSupported
	return (
		<section id="quickGlance" class="mb-2">
			{ok && (
				<Entry icon={BadgeCheckIcon} title="OK" type="ok">
					Your device is working perfectly!
					<br />
					<small>We have detected no issues with your device.</small>
				</Entry>
			)}
			{!ok && (
				<Entry icon={TriangleAlertIcon} title="Not OK" type="notOk">
					We have detected problems with your device!
					<br />
					<small>
						There are some issues with your device that may impact your ability
						to explore all of it's features.
					</small>
				</Entry>
			)}
			{!hasLiveData && (
				<Entry icon={CloudOffIcon} title="Live data missing" type="warning">
					Waiting for data from your device
					<br />
					<small>The device has not yet connected to the cloud.</small>
				</Entry>
			)}
			{(needsFwUpdate || needsMfwUpdate) && (
				<Entry
					icon={CloudDownloadIcon}
					title="FOTA"
					type="warning"
					action={{
						label: 'Schedule FOTA',
						onClick: () => {},
					}}
				>
					Firmware updated needed
					<br />
					<small>
						The firmware on your device is not up to date. You can schedule a
						FOTA in the section below.
					</small>
				</Entry>
			)}
			{!fotaSupported && (
				<Entry icon={CloudDownloadIcon} title="FOTA" type="warning">
					Firmware updated not supported
					<br />
					<small>
						The device does not support Firmware updates over the air (FOTA).
					</small>
				</Entry>
			)}
		</section>
	)
}

const Entry = ({
	icon,
	title,
	children,
	action,
	type,
}: PropsWithChildren<{
	type: 'ok' | 'notOk' | 'warning'
	icon: LucideIcon
	title: string
	action?: {
		label: string
		onClick: () => void
	}
}>) => (
	<div style={styleForType(type)}>
		<div class="container">
			<div class="row">
				<div class="col-12 col-lg-8 py-2 d-flex align-items-center flex-row">
					<span class="icon" style={{ opacity: 0.8 }}>
						{icon({ size: 36, strokeWidth: 1, class: 'me-2', title })}
					</span>
					<div class="d-flex align-items-center justify-content-between flex-grow-1">
						<p class="m-0 me-3">{children}</p>
						{action && (
							<SecondaryLink href="#fota">{action.label}</SecondaryLink>
						)}
					</div>
				</div>
			</div>
		</div>
	</div>
)

const styleForType = (type: string) => {
	switch (type) {
		case 'ok':
			return {
				backgroundColor: 'var(--color-status-ok)',
				color: 'var(--text-color-status-ok)',
			}
		case 'notOk':
			return {
				backgroundColor: 'var(--color-status-problem)',
				color: 'var(--text-color-status-problem)',
			}
		case 'warning':
			return {
				backgroundColor: 'var(--color-status-warning)',
				color: 'var(--text-color-status-warning)',
			}
		default:
			return {}
	}
}

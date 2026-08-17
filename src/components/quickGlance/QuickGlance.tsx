import { DeviceHasProblems } from '#components/quickGlance/DeviceHasProblems.tsx'
import { FOTANotSupported } from '#components/quickGlance/FOTANotSupported.tsx'
import { NeedsFOTA } from '#components/quickGlance/NeedsFOTA.tsx'
import { SIMNoData } from '#components/quickGlance/SIMNoData.tsx'
import { WaitingForData } from '#components/quickGlance/WaitingForData.tsx'
import { useDevice } from '#context/Device.tsx'
import { FirmwareUpdateSeverity, useFOTA } from '#context/FOTA.tsx'
import { useSIMDetails } from '#context/SIMDetails.tsx'
import cx from 'classnames'
import { AllOK } from './AllOK.tsx'

import { isProduction } from '#utils/isProduction.ts'
import { useEffect, useState } from 'preact/hooks'
import './QuickGlance.css'

export const QuickGlance = ({ class: className }: { class?: string }) => {
	const {
		needsFwUpdate,
		needsMfwUpdate,
		fwUpdateSeverity,
		mfwUpdateSeverity,
		fwTypes,
	} = useFOTA()
	const { hasLiveData } = useDevice()
	const { usage } = useSIMDetails()
	const fotaSupported = fwTypes.length > 0
	const noSIMData = usage !== undefined && usage.availablePercent < 0.05
	const fwOk =
		!needsFwUpdate ||
		(needsFwUpdate && fwUpdateSeverity === FirmwareUpdateSeverity.Normal)
	const mfwOk =
		!needsMfwUpdate ||
		(needsMfwUpdate && mfwUpdateSeverity === FirmwareUpdateSeverity.Normal)
	const ok = fwOk && mfwOk && hasLiveData && fotaSupported && !noSIMData
	const [warmupTimePassed, setWarmupTimePassed] = useState(false)

	// Allow the user to turn on the device before showing the error message that the device has not sent any data
	useEffect(() => {
		const t = setTimeout(
			() => {
				setWarmupTimePassed(true)
			},
			isProduction ? 5 * 60 * 1000 : 1000,
		)
		return () => clearTimeout(t)
	})

	return (
		<section
			id="quickGlance"
			class={cx(`QuickGlance`, className, {
				notOk: !ok,
				'mb-2': ok,
				'mb-4': !ok,
			})}
		>
			{ok && <AllOK />}
			{!ok && !hasLiveData && warmupTimePassed && <DeviceHasProblems />}
			{!ok && !hasLiveData && <WaitingForData />}
			{hasLiveData && (
				<>
					{(!fwOk || !mfwOk) && <NeedsFOTA />}
					{!fotaSupported && <FOTANotSupported />}
				</>
			)}
			{noSIMData === true && <SIMNoData />}
		</section>
	)
}

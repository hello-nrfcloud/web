import { DeviceHasProblems } from '#components/quickGlance/DeviceHasProblems.js'
import { FOTANotSupported } from '#components/quickGlance/FOTANotSupported.js'
import { NeedsFOTA } from '#components/quickGlance/NeedsFOTA.js'
import { SIMNoData } from '#components/quickGlance/SIMNoData.js'
import { WaitingForData } from '#components/quickGlance/WaitingForData.js'
import { useDevice } from '#context/Device.js'
import { FirmwareUpdateSeverity, useFOTA } from '#context/FOTA.js'
import { useSIMDetails } from '#context/SIMDetails.js'
import cx from 'classnames'
import { AllOK } from './AllOK.js'

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
			{!ok && <DeviceHasProblems />}
			{!hasLiveData && <WaitingForData />}
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

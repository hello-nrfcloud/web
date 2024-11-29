import { Ago } from '#components/Ago.js'
import {
	EnergyEstimateIcons,
	EnergyEstimateLabel,
} from '#components/SignalQuality.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDevice } from '#context/Device.js'
import {
	isConnectionInformation,
	toConnectionInformation,
} from '#proto/lwm2m.js'
import { Slash } from 'lucide-preact'

export const SignalQualityInfo = () => {
	const { reported } = useDevice()
	const { eest, ts } =
		Object.values(reported)
			.filter(isConnectionInformation)
			.map(toConnectionInformation)[0] ?? {}

	// The current firmware does not report signal quality (https://github.com/hello-nrfcloud/firmware/issues/499)
	// so we exit early and not show the loading animation.

	if (eest === undefined) return null

	return (
		<span class="d-flex flex-column" style={{ minWidth: '100px' }}>
			<small class="text-muted">
				<strong>Signal Quality</strong>
			</small>
			{eest === undefined && (
				<>
					<LoadingIndicator height={24} width={75} />
					<LoadingIndicator height={16} width={100} class="mt-1" />
				</>
			)}
			{eest !== undefined && (
				<>
					<span class="d-flex align-items-center">
						{((SignalIcon) => (
							<SignalIcon strokeWidth={2} class="me-2" />
						))(EnergyEstimateIcons.get(eest) ?? Slash)}
						<span>{EnergyEstimateLabel.get(eest)}</span>
					</span>
					{ts !== undefined && (
						<small class="text-muted">
							<Ago date={ts} key={ts.toISOString()} />
						</small>
					)}
				</>
			)}
		</span>
	)
}

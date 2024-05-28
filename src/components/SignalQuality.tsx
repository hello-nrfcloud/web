import {
	Signal,
	SignalHigh,
	SignalLow,
	SignalMedium,
	SignalZero,
	Slash,
} from 'lucide-preact'
import { LoadingIndicator } from '#components/ValueLoading.js'
import type { LucideProps } from '#components/icons/lucide.js'
import type { FunctionComponent } from 'preact'
import {
	isConnectionInformation,
	toConnectionInformation,
} from '#proto/lwm2m.js'
import { useDevice } from '#context/Device.js'

/**
 * The %CONEVAL AT command returns amongst other data the energy estimate: Relative estimated energy consumption of data transmission compared to nominal consumption. A higher value means smaller energy consumption. 5: Difficulties in setting up connections. Maximum number of repetitions might be needed for data.
 *
 * @see https://infocenter.nordicsemi.com/topic/ref_at_commands/REF/at_commands/mob_termination_ctrl_status/coneval_set.html
 */
export enum EnergyEstimate {
	/**
	 * Bad conditions. Difficulties in setting up connections. Maximum number of repetitions might be needed for data.
	 */
	Bad = 5,
	/**
	 * Poor conditions. Setting up a connection might require retries and a higher number of repetitions for data.
	 */
	Poor = 6,
	/**
	 * Normal conditions for cIoT device. No repetitions for data or only a few repetitions in the worst case.
	 */
	Normal = 7,
	/**
	 * Good conditions. Possibly very good conditions for small amounts of data.
	 */
	Good = 8,
	/**
	 * Excellent conditions. Efficient data transfer estimated also for larger amounts of data.
	 */
	Excellent = 9,
}

export const EnergyEstimateIcons = new Map<
	EnergyEstimate,
	FunctionComponent<LucideProps>
>([
	[EnergyEstimate.Bad, SignalZero],
	[EnergyEstimate.Poor, SignalLow],
	[EnergyEstimate.Normal, SignalMedium],
	[EnergyEstimate.Good, SignalHigh],
	[EnergyEstimate.Excellent, Signal],
])

export const EnergyEstimateDescription = new Map<EnergyEstimate, string>([
	[
		EnergyEstimate.Bad,
		'Bad conditions. Difficulties in setting up connections. Maximum number of repetitions might be needed for data.',
	],
	[
		EnergyEstimate.Poor,
		'Poor conditions. Setting up a connection might require retries and a higher number of repetitions for data.',
	],
	[
		EnergyEstimate.Normal,
		'Normal conditions for cIoT device. No repetitions for data or only a few repetitions in the worst case.',
	],
	[
		EnergyEstimate.Good,
		'Good conditions. Possibly very good conditions for small amounts of data.',
	],
	[
		EnergyEstimate.Excellent,
		'Excellent conditions. Efficient data transfer estimated also for larger amounts of data.',
	],
])

export const EnergyEstimateLabel = new Map<EnergyEstimate, string>([
	[EnergyEstimate.Bad, 'Bad'],
	[EnergyEstimate.Poor, 'Poor'],
	[EnergyEstimate.Normal, 'Normal'],
	[EnergyEstimate.Good, 'Good'],
	[EnergyEstimate.Excellent, 'Excellent'],
])

export const SignalQuality = () => {
	const { reported: state } = useDevice()

	const eest = state
		.filter(isConnectionInformation)
		.map(toConnectionInformation)[0]?.eest

	return (
		<>
			<p class="mb-0">
				<SignalQualityIcon />
			</p>
			{eest === undefined && (
				<p>
					<LoadingIndicator height={16} />
				</p>
			)}
			{eest !== undefined && <SignalQualityDescription eest={eest} />}
		</>
	)
}

export const SignalQualityIcon = () => {
	const { reported: state } = useDevice()
	const eest = state
		.filter(isConnectionInformation)
		.map(toConnectionInformation)[0]?.eest

	if (eest === undefined) return <LoadingIndicator height={24} width={75} />
	const SignalIcon = EnergyEstimateIcons.get(eest) ?? Slash
	return (
		<span class="d-flex align-items-center">
			<SignalIcon strokeWidth={2} />
			<span>{EnergyEstimateLabel.get(eest)}</span>
		</span>
	)
}

export const SignalQualityDescription = ({
	eest,
}: {
	eest: EnergyEstimate
}) => (
	<>
		<p class="text-muted mb-0">{EnergyEstimateDescription.get(eest)}</p>
		<p>
			<small class="text-muted">
				Signal quality is reported by the modem using the{' '}
				<a
					href="https://infocenter.nordicsemi.com/topic/nwp_043/WP/nwp_043/intro.html"
					target="_blank"
				>
					Nordic-proprietary <code>%CONEVAL</code> AT command
				</a>
				.
			</small>
		</p>
	</>
)

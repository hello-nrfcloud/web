import type { LucideProps } from '#components/icons/lucide.js'
import {
	Signal,
	SignalHigh,
	SignalLow,
	SignalMedium,
	SignalZero,
} from 'lucide-preact'
import type { FunctionComponent } from 'preact'

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

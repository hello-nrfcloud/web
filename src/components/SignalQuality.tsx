import { EnergyEstimate } from '@hello.nrfcloud.com/proto/hello'
import {
	Signal,
	SignalHigh,
	SignalLow,
	SignalMedium,
	SignalZero,
	Slash,
	type LucideProps,
} from 'lucide-preact'

const EnergyEstimateIcons: Record<
	EnergyEstimate,
	(props: LucideProps) => JSX.Element
> = {
	[EnergyEstimate.Bad]: SignalZero,
	[EnergyEstimate.Poor]: SignalLow,
	[EnergyEstimate.Normal]: SignalMedium,
	[EnergyEstimate.Good]: SignalHigh,
	[EnergyEstimate.Excellent]: Signal,
} as const

const EnergyEstimateDescription: Record<EnergyEstimate, string> = {
	[EnergyEstimate.Bad]:
		'Bad conditions. Difficulties in setting up connections. Maximum number of repetitions might be needed for data.',
	[EnergyEstimate.Poor]:
		'Poor conditions. Setting up a connection might require retries and a higher number of repetitions for data.',
	[EnergyEstimate.Normal]:
		'Normal conditions for cIoT device. No repetitions for data or only a few repetitions in the worst case.',
	[EnergyEstimate.Good]:
		'Good conditions. Possibly very good conditions for small amounts of data.',
	[EnergyEstimate.Excellent]:
		'Excellent conditions. Efficient data transfer estimated also for larger amounts of data.',
} as const

const EnergyEstimateLabel: Record<EnergyEstimate, string> = {
	[EnergyEstimate.Bad]: 'Bad',
	[EnergyEstimate.Poor]: 'Poor',
	[EnergyEstimate.Normal]: 'Normal',
	[EnergyEstimate.Good]: 'Good',
	[EnergyEstimate.Excellent]: 'Excellent',
} as const

export const SignalQuality = ({ eest }: { eest: EnergyEstimate }) => {
	const SignalIcon = EnergyEstimateIcons[eest] ?? Slash
	return (
		<>
			<p class="mb-0">
				<span class="d-flex align-items-center">
					<SignalIcon strokeWidth={2} />
					<span>{EnergyEstimateLabel[eest]}</span>
				</span>
			</p>
			<p>
				<small class="text-muted">{EnergyEstimateDescription[eest]}</small>
			</p>
		</>
	)
}

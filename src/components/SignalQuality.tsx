import { useDeviceState } from '#context/DeviceState.js'
import { EnergyEstimate } from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import {
	Signal,
	SignalHigh,
	SignalLow,
	SignalMedium,
	SignalZero,
	Slash,
} from 'lucide-preact'
import { LoadingIndicator } from './ValueLoading.js'
import type { LucideProps } from './icons/lucide.js'
import type { FunctionComponent } from 'preact'

export const EnergyEstimateIcons: Record<
	EnergyEstimate,
	FunctionComponent<LucideProps>
> = {
	[EnergyEstimate.Bad]: SignalZero,
	[EnergyEstimate.Poor]: SignalLow,
	[EnergyEstimate.Normal]: SignalMedium,
	[EnergyEstimate.Good]: SignalHigh,
	[EnergyEstimate.Excellent]: Signal,
} as const

export const EnergyEstimateDescription: Record<EnergyEstimate, string> = {
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

export const EnergyEstimateLabel: Record<EnergyEstimate, string> = {
	[EnergyEstimate.Bad]: 'Bad',
	[EnergyEstimate.Poor]: 'Poor',
	[EnergyEstimate.Normal]: 'Normal',
	[EnergyEstimate.Good]: 'Good',
	[EnergyEstimate.Excellent]: 'Excellent',
} as const

export const SignalQuality = () => {
	const { state } = useDeviceState()
	const { eest } = state?.device?.networkInfo ?? {}
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
	const { state } = useDeviceState()
	const { eest } = state?.device?.networkInfo ?? {}
	if (eest === undefined) return <LoadingIndicator height={24} width={75} />
	const SignalIcon = EnergyEstimateIcons[eest] ?? Slash
	return (
		<span class="d-flex align-items-center">
			<SignalIcon strokeWidth={2} />
			<span>{EnergyEstimateLabel[eest]}</span>
		</span>
	)
}

export const SignalQualityDescription = ({
	eest,
}: {
	eest: EnergyEstimate
}) => (
	<>
		<p class="text-muted mb-0">{EnergyEstimateDescription[eest]}</p>
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

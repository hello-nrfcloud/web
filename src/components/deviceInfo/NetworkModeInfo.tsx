import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDeviceState } from '#context/DeviceState.js'
import { LTEm } from '../icons/LTE-m.js'
import { NBIot } from '../icons/NBIot.js'

export const NetworkModeInfo = () => {
	const { state } = useDeviceState()
	const { networkMode } = state?.device?.networkInfo ?? {}

	return (
		<>
			<p class="mb-0">
				<NetworkModeIcon />
			</p>
			{networkMode === undefined && <LoadingIndicator height={16} />}
			{networkMode !== undefined && (
				<p>
					{(networkMode?.includes('LTE-M') ?? false) && (
						<small class="text-muted">
							Low Power, Mobility, and Low Latency for Your Applications
						</small>
					)}
					{(networkMode?.includes('NB-IoT') ?? false) && (
						<small class="text-muted">
							Low Power, Range, and Adaptability for Your Applications
						</small>
					)}
				</p>
			)}
		</>
	)
}

export const NetworkModeIcon = () => {
	const { state } = useDeviceState()
	const { networkMode, currentBand } = state?.device?.networkInfo ?? {}
	if (networkMode === undefined || currentBand === undefined)
		return <LoadingIndicator height={25} width={70} />
	return (
		<span>
			<abbr title={`Band ${currentBand}`} class="me-2">
				{networkMode?.includes('LTE-M') ?? false ? (
					<LTEm style={{ width: 'auto', height: '25px' }} />
				) : (
					<NBIot style={{ width: 'auto', height: '25px' }} />
				)}
			</abbr>
		</span>
	)
}

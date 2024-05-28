import { LoadingIndicator } from '#components/ValueLoading.js'
import {
	isConnectionInformation,
	toConnectionInformation,
} from '#proto/lwm2m.js'
import { LTEm } from '#components/icons/LTE-m.js'
import { NBIot } from '#components/icons/NBIot.js'
import { useDevice } from '#context/Device.js'

export const NetworkModeInfo = () => {
	const { reported: state } = useDevice()
	const networkMode = state
		.filter(isConnectionInformation)
		.map(toConnectionInformation)[0]?.networkMode

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
	const { reported: state } = useDevice()
	const networkInfo = state
		.filter(isConnectionInformation)
		.map(toConnectionInformation)[0]
	const { networkMode, currentBand } = networkInfo ?? {}
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

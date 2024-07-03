import { Ago } from '#components/Ago.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { useDevice } from '#context/Device.js'
import { isDeviceInformation, toDeviceInformation } from '#proto/lwm2m.js'
import { ArrowUpDownIcon } from 'lucide-preact'
import { SIMDetails } from '#components/SIMDetails.js'
import { formatFloat } from '#utils/format.js'

export const SIMInfo = () => {
	const { reported } = useDevice()
	const { iccid, ts } =
		Object.values(reported)
			.filter(isDeviceInformation)
			.map(toDeviceInformation)[0] ?? {}

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>SIM</strong>
			</small>
			{iccid === undefined && <LoadingIndicator />}
			{iccid !== undefined && (
				<SIMDetails iccid={iccid}>
					{({ issuer, usage }) => (
						<>
							<span>
								<SIMIcon class="me-2" />
								<abbr title={iccid}>{issuer?.companyName ?? '?'}</abbr>
							</span>
							{usage !== undefined && (
								<span>
									<ArrowUpDownIcon size={20} class="me-2" />
									<abbr
										data-testid="sim-usage"
										title={`Used ${formatFloat(usage.used / 1000 / 1000)} of ${formatFloat(usage.total / 1000 / 1000)} MB`}
									>
										{`${usage.availablePercent * 100}`}&nbsp;%{' '}
										<small>data available</small>
									</abbr>
								</span>
							)}
						</>
					)}
				</SIMDetails>
			)}
			{ts === undefined && (
				<LoadingIndicator height={16} width={100} class="mt-1" />
			)}
			{ts !== undefined && (
				<small class="text-muted">
					<Ago date={ts} key={ts.toISOString()} />
				</small>
			)}
		</span>
	)
}

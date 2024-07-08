import { Ago } from '#components/Ago.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { useSIMDetails } from '#context/SIMDetails.js'
import { formatFloat, formatInt } from '#utils/format.js'
import { ArrowUpDownIcon } from 'lucide-preact'

export const SIMInfo = () => {
	const { iccid, usage, issuer, lastUpdated } = useSIMDetails()

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>SIM</strong>
			</small>
			{iccid === undefined && <LoadingIndicator />}
			{lastUpdated === undefined && (
				<LoadingIndicator height={16} width={100} class="mt-1" />
			)}
			{iccid !== undefined && (
				<>
					<span>
						<SIMIcon class="me-2" />
						<abbr title={iccid}>{issuer?.companyName ?? '?'}</abbr>
					</span>
					{usage !== undefined && (
						<>
							<span>
								<ArrowUpDownIcon size={20} class="me-2" />
								<abbr
									data-testid="sim-usage"
									title={`Used ${formatFloat(usage.used / 1000 / 1000)} of ${formatFloat(usage.total / 1000 / 1000)} MB`}
								>
									{`${formatInt(usage.availablePercent * 100)}`}&nbsp;%{' '}
									<small>data available</small>
								</abbr>
							</span>
						</>
					)}
					{lastUpdated !== undefined && (
						<small class="text-muted">
							<Ago date={lastUpdated} key={lastUpdated.toISOString()} />
						</small>
					)}
				</>
			)}
		</span>
	)
}

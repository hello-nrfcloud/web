import { Ago } from '#components/Ago.tsx'
import { LoadingIndicator } from '#components/ValueLoading.tsx'
import { LTEM } from '#components/icons/LTE-M.tsx'
import { NBIot } from '#components/icons/NBIot.tsx'
import { useDevice } from '#context/Device.tsx'
import {
	isConnectionInformation,
	toConnectionInformation,
} from '#proto/lwm2m.ts'
import { CountryFlag } from '../CountryFlag.tsx'

export const NetworkModeInfo = () => {
	const { reported } = useDevice()
	const { networkMode, currentBand, mccmnc, ts } =
		Object.values(reported)
			.filter(isConnectionInformation)
			.map(toConnectionInformation)[0] ?? {}

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Network</strong>
			</small>
			{(networkMode === undefined || currentBand === undefined) && (
				<>
					<LoadingIndicator height={25} width={70} />
					<LoadingIndicator height={16} width={100} class="mt-1" />
				</>
			)}

			{networkMode !== undefined && currentBand !== undefined && (
				<span>
					<abbr
						title={`${networkMode}, Band: ${currentBand}`}
						class="me-2"
						data-testid="network-band"
					>
						{(networkMode?.includes('LTE-M') ?? false) ? (
							<LTEM
								style={{
									height: '25px',
									width: 'auto',
								}}
								data-testid="network-mode-icon"
							/>
						) : (
							<NBIot
								style={{
									height: '25px',
									width: 'auto',
								}}
							/>
						)}
					</abbr>
					{mccmnc !== undefined && (
						<CountryFlag data-testid="network-country-flag" mccmnc={mccmnc} />
					)}
				</span>
			)}
			{ts !== undefined && (
				<small class="text-muted">
					<Ago date={ts} key={ts.toISOString()} />
				</small>
			)}
		</span>
	)
}

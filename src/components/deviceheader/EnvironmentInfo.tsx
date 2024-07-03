import { Ago } from '#components/Ago.js'
import { IAQ } from '#components/BME680.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDevice } from '#context/Device.js'
import { isEnvironment, toEnvironment } from '#proto/lwm2m.js'
import { formatFloat } from '#utils/format.js'
import { ThermometerIcon } from 'lucide-preact'

export const EnvironmentInfo = () => {
	const { reported } = useDevice()
	const environment = Object.values(reported)
		.filter(isEnvironment)
		.map(toEnvironment)[0]
	const { IAQ: iaq, c, ts: updateTime } = environment ?? {}

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Environment</strong>
			</small>
			{c === undefined && <LoadingIndicator width={150} />}
			{c !== undefined && (
				<span class="me-2">
					<ThermometerIcon /> {formatFloat(c)} °C
				</span>
			)}
			{iaq === undefined && <LoadingIndicator width={150} class="mt-1" />}
			{iaq !== undefined && (
				<span class="me-2">
					<IAQ iaq={iaq} />
				</span>
			)}
			{updateTime === undefined && (
				<LoadingIndicator height={16} width={100} class="mt-1" />
			)}
			{updateTime !== undefined && (
				<small class="text-muted">
					<Ago
						date={new Date(updateTime)}
						key={new Date(updateTime).toISOString()}
					/>
				</small>
			)}
		</span>
	)
}

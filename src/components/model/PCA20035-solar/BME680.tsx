import { LoadingIndicator } from '#components/ValueLoading.js'
import { useSolarThingyHistory } from '#context/models/PCA20035-solar.js'
import {
	AngryIcon,
	AnnoyedIcon,
	BanIcon,
	CloudSunRainIcon,
	DropletsIcon,
	FrownIcon,
	LaughIcon,
	MehIcon,
	SkullIcon,
	SmileIcon,
	ThermometerIcon,
} from 'lucide-preact'

export const BME680 = () => (
	<>
		<h2>Environment</h2>
		<EnvironmentReadings />
		<p>
			<small class="text-muted">
				These values are reported by the devices'{' '}
				<a
					href="https://www.bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme680/"
					target="_blank"
				>
					Bosch BME680 environment sensor
				</a>
				.<br />
				The air quality rating is based on a proprietary algorithm. See page 8
				in{' '}
				<a
					href="https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme680-ds001.pdf"
					target="_blank"
				>
					the BME680 datasheet
				</a>
				.
			</small>
		</p>
	</>
)

export const EnvironmentReadings = () => {
	const { airHumidity, airPressure, airQuality, airTemperature } =
		useSolarThingyHistory()
	const airHumidityReading = airHumidity[0]
	const airPressureReading = airPressure[0]
	const airQualityReading = airQuality[0]
	const airTemperatureReading = airTemperature[0]
	const updateTime =
		airHumidityReading?.ts ??
		airPressureReading?.ts ??
		airQualityReading?.ts ??
		airTemperatureReading?.ts

	const { p } = airHumidityReading ?? {}
	const { mbar } = airPressureReading ?? {}
	const { IAQ: iaq } = airQualityReading ?? {}
	const { c } = airTemperatureReading ?? {}

	return (
		<>
			{updateTime === undefined && <LoadingIndicator width={500} />}
			{updateTime !== undefined && (
				<span>
					{c !== undefined && (
						<span class="me-2">
							<ThermometerIcon /> {c} °C
						</span>
					)}
					{p !== undefined && (
						<span class="me-2">
							<DropletsIcon /> {p} %
						</span>
					)}
					{mbar !== undefined && (
						<span class="me-2">
							<CloudSunRainIcon /> {Math.round(mbar)} mbar
						</span>
					)}
					{iaq !== undefined && (
						<span class="me-2">
							<IAQ iaq={iaq} />
						</span>
					)}
				</span>
			)}
		</>
	)
}

// See https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme680-ds001.pdf
export const IAQ = ({ iaq }: { iaq: number }) => {
	let iaqLabel = 'unknown'
	let Icon = BanIcon
	if (iaq >= 0 && iaq <= 50) {
		iaqLabel = 'Excellent'
		Icon = LaughIcon
	} else if (iaq <= 100) {
		iaqLabel = 'Good'
		Icon = SmileIcon
	} else if (iaq <= 150) {
		iaqLabel = 'Lightly Polluted'
		Icon = MehIcon
	} else if (iaq <= 200) {
		iaqLabel = 'Moderately Polluted'
		Icon = AnnoyedIcon
	} else if (iaq <= 250) {
		iaqLabel = 'Heavily Polluted'
		Icon = FrownIcon
	} else if (iaq <= 350) {
		iaqLabel = 'Severely Polluted'
		Icon = AngryIcon
	} else if (iaq > 350) {
		iaqLabel = 'Extremely Polluted'
		Icon = SkullIcon
	}

	return (
		<abbr title={iaqLabel} class="text-nowrap">
			<Icon strokeWidth={2} /> <span>{iaqLabel} air quality</span>
		</abbr>
	)
}

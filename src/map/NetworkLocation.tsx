import { CountryFlag } from '#components/CountryFlag.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { mccmnc2country } from '#components/mccmnc2country.js'
import { useDevice } from '#context/Device.js'
import {
	isConnectionInformation,
	toConnectionInformation,
} from '#proto/lwm2m.js'

export const NetworkLocation = () => {
	const { reported } = useDevice()
	const mccmnc = Object.values(reported)
		.filter(isConnectionInformation)
		.map(toConnectionInformation)[0]?.mccmnc
	const country =
		mccmnc === undefined ? undefined : mccmnc2country(mccmnc)?.name
	if (mccmnc === undefined || country === undefined)
		return (
			<>
				<h2>
					Network location <LoadingIndicator light width={20} height={15} />
				</h2>
				<p>
					Based on the network your device is connected to, it can be coarsely
					located in a country right after it connected.
				</p>
			</>
		)
	return (
		<>
			<h2>Network location: {<CountryFlag mccmnc={mccmnc} />}</h2>
			<p>
				Based on the network code (<code>{mccmnc}</code>) your device is
				registered to, it can be coarsely located in {country}.
			</p>
		</>
	)
}

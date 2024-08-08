import { Ago } from '#components/Ago.js'
import { LocationSourceLabels } from '#map/LocationSourceLabels.js'
import { type GeoLocation } from '#proto/lwm2m.js'
import { formatInt } from '#utils/format.js'

export const Located = ({ location }: { location: GeoLocation }) => (
	<p>
		<span>
			Using {LocationSourceLabels.get(location.src) ?? location.src}, the
			location was determined
		</span>{' '}
		{location.acc !== undefined ? (
			<>with an accuracy of {formatInt(location.acc)} m</>
		) : (
			<>with an unspecified accuracy</>
		)}
		.{' '}
		<small style={{ opacity: 0.8 }}>
			<Ago date={location.ts} />
		</small>
	</p>
)

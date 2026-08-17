import { Ago } from '#components/Ago.tsx'
import { LocationSourceLabels } from '#map/LocationSourceLabels.ts'
import { type GeoLocation } from '#proto/lwm2m.ts'
import { formatInt } from '#utils/format.ts'

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

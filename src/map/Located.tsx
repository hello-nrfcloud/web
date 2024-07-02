import { LocationSourceLabels } from '#map/LocationSourceLabels.js'
import { type GeoLocation } from '#proto/lwm2m.js'
import { formatFloat, formatInt } from '#utils/format.js'

export const Located = ({ location }: { location: GeoLocation }) => (
	<p>
		Using {LocationSourceLabels.get(location.src) ?? location.src}, the location
		was determined to be{' '}
		<a
			href={`https://google.com/maps/search/${location.lat},${location.lng}`}
			target="_blank"
		>
			{formatFloat(location.lat, 5)}, {formatFloat(location.lng, 5)}
		</a>{' '}
		{location.acc !== undefined ? (
			<>with an accuracy of {formatInt(location.acc)} m</>
		) : (
			<>with an unspecified accuary</>
		)}
		.
	</p>
)

import { Ago } from '#components/Ago.js'
import { Transparent } from '#components/Buttons.js'
import { useMapInstance } from '#context/MapInstance.js'
import { LocationSourceLabels } from '#map/LocationSourceLabels.js'
import { type GeoLocation } from '#proto/lwm2m.js'
import { formatFloat, formatInt } from '#utils/format.js'
import { centerMapOnLocation } from './centerMapOnLocation.js'

export const Located = ({ location }: { location: GeoLocation }) => {
	const { map } = useMapInstance()
	return (
		<p>
			Using {LocationSourceLabels.get(location.src) ?? location.src}, the
			location was determined to be{' '}
			<Transparent
				onClick={() => {
					if (map === undefined) return
					centerMapOnLocation(map, location)
					document.getElementById('map')?.scrollIntoView()
				}}
			>
				{formatFloat(location.lat, 5)}, {formatFloat(location.lng, 5)}
			</Transparent>{' '}
			{location.acc !== undefined ? (
				<>with an accuracy of {formatInt(location.acc)} m</>
			) : (
				<>with an unspecified accuary</>
			)}
			.{' '}
			<small style={{ opacity: 0.8 }}>
				<Ago date={location.ts} />
			</small>
		</p>
	)
}

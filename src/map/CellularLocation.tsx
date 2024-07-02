import { LoadingIndicator } from '#components/ValueLoading.js'
import { NRFCloudLogo } from '#components/icons/NRFCloudLogo.js'
import { useDeviceLocation } from '#context/DeviceLocation.js'
import {
	LocationSource,
	LocationSourceLabels,
} from '#map/LocationSourceLabels.js'
import { Located } from './Located.js'
import { compareLocations } from '#map/compareLocations.js'
import type { GeoLocation } from '#proto/lwm2m.js'

export const CellularLocation = () => {
	const { locations } = useDeviceLocation()
	const scellLocation = locations[LocationSource.SCELL]
	const mcellLocation = locations[LocationSource.MCELL]
	const cellularLocations: GeoLocation[] = []
	if (scellLocation !== undefined) cellularLocations.push(scellLocation)
	if (mcellLocation !== undefined) cellularLocations.push(mcellLocation)
	return (
		<>
			<h2 class="d-flex justify-content-start align-items-center">
				<NRFCloudLogo style={{ height: '18px' }} />
				<span class="ms-2">Device location</span>
			</h2>
			<p>
				A more precise device location can be determined using{' '}
				<a
					href="https://www.nordicsemi.com/Products/Cloud-services"
					target="_blank"
				>
					nRF Cloud Location services
				</a>{' '}
				based on the device scanning the network and reporting neighboring cell
				information and Wi-Fi access points it can detect and reporting this
				information to the cloud.
			</p>
			<p>
				Single-cell (SCELL) provides a power efficient option to locate the
				device and consumes little power from the device. This is highly
				beneficial for indoor location, no-power scenarios or crude-location
				without requiring GPS.
			</p>
			<p>
				Multi-cell (MCELL) is using multiple cell towers to triangulate the
				device location. Up to 17 cell towers can be used at once.
			</p>
			<p>
				Wi-Fi is using the IDs of nearby Wi-Fi access points to triangulate the
				device location. Like cellular-based location, this saves power by
				eliminating the need for the GNSS receiver and works especially well in
				urban areas and indoors.
			</p>
			{cellularLocations.length === 0 && (
				<>
					<p>If available, the map will show both locations for comparison.</p>
					<p>
						<LoadingIndicator light height={60} width={'100%'} />
					</p>
				</>
			)}
			{cellularLocations.map((location) => (
				<>
					<h2>{LocationSourceLabels.get(location.src)}</h2>
					<Located location={location} />
				</>
			))}
			{scellLocation !== undefined &&
				mcellLocation !== undefined &&
				compareLocations(scellLocation, mcellLocation) === true && (
					<div
						role="alert"
						style={{
							color: 'var(--color-nordic-sun)',
						}}
					>
						<p>
							The geo location for the device using single-cell and multi-cell
							information has been determined to be the same. This happens in
							case there are not enough neighboring cell towers
							&quot;visible&quot; by the device.
						</p>
					</div>
				)}
		</>
	)
}

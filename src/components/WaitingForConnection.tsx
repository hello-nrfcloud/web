import { ConnectDevice } from '#components/ConnectDevice.js'
import { useDevice } from '#context/Device.js'
import { updateIntervalSeconds } from '#context/Models.js'

export const WaitingForConnection = () => {
	const {
		lastSeen,
		configuration: {
			reported: { mode },
		},
	} = useDevice()

	const hasLiveData =
		lastSeen !== undefined &&
		Date.now() - lastSeen.getTime() < updateIntervalSeconds(mode) * 1000

	if (hasLiveData) return null

	return <ConnectDevice />
}

import { ConnectDevice } from '#components/ConnectDevice.js'
import { useDevice } from '#context/Device.js'

export const WaitingForConnection = () => {
	const {
		lastSeen,
		configuration: { reported },
	} = useDevice()

	let hasLiveData = lastSeen !== undefined

	if (lastSeen !== undefined && reported?.updateIntervalSeconds !== undefined) {
		hasLiveData =
			Date.now() - lastSeen.getTime() < reported.updateIntervalSeconds * 1000
	}

	if (hasLiveData) return null

	return <ConnectDevice />
}

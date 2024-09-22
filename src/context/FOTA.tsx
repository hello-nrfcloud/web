import { isOutdated } from '#components/fota/isOutdated.js'
import type { Model } from '#content/models/types.js'
import {
	isDeviceInformation,
	isNRFCloudServiceInfo,
	toDeviceInformation,
	toNRFCloudServiceInfo,
} from '#proto/lwm2m.js'
import { parseModemFirmwareVersion } from '#utils/parseModemFirmwareVersion.js'
import { validatingFetch, type ResultHandlers } from '#utils/validatingFetch.js'
import { type LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/lwm2m'
import {
	FOTAJob,
	FOTAJobs,
	type FOTAJobTarget,
	type UpgradePath,
} from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice } from './Device.js'

export type Device = {
	id: string
	model: Model
}

export type Configuration = {
	updateIntervalSeconds: number
	gnssEnabled: boolean
}

export const FOTAContext = createContext<{
	jobs: Array<Static<typeof FOTAJob>>
	scheduleJob: (
		upgradePath: Static<typeof UpgradePath>,
		target: FOTAJobTarget,
	) => ResultHandlers<typeof FOTAJob>
	needsFwUpdate: boolean
	fwUpdateSeverity?: FirmwareUpdateSeverity
	needsMfwUpdate: boolean
	mfwUpdateSeverity?: FirmwareUpdateSeverity
	appV?: string
	modV?: string
	/**
	 * The supported FW update types
	 */
	fwTypes: Array<string>
}>({
	jobs: [],
	scheduleJob: () => {
		throw new Error(`Not implemented!`)
	},
	needsFwUpdate: false,
	needsMfwUpdate: false,
	fwTypes: [],
})

export type ListenerFn = (instance: LwM2MObjectInstance) => unknown

export enum FirmwareUpdateSeverity {
	Important,
	Normal,
}

export const Provider = ({
	device,
	children,
	helloApiURL,
	fingerprint,
}: {
	fingerprint: string
	helloApiURL: URL
	children: ComponentChildren
	device: Device
}) => {
	const [jobs, setJobs] = useState<Array<Static<typeof FOTAJob>>>([])

	const { reported } = useDevice()
	const model = device.model

	const deviceInfo = Object.values(reported)
		.filter(isDeviceInformation)
		.map(toDeviceInformation)[0]

	const appV = deviceInfo?.appVersion
	const modV = parseModemFirmwareVersion(deviceInfo?.modemFirmware ?? '')

	const needsFwUpdate =
		appV !== undefined && isOutdated(model.firmware.version, appV)
	const needsMfwUpdate =
		modV !== undefined && isOutdated(model.mfw.version, modV)

	const serviceInfo = Object.values(reported)
		.filter(isNRFCloudServiceInfo)
		.map(toNRFCloudServiceInfo)[0]
	const fwTypes = serviceInfo?.fwTypes ?? []

	useEffect(() => {
		validatingFetch(FOTAJobs)(
			new URL(
				`./device/${device.id}/fota/jobs?${new URLSearchParams({ fingerprint }).toString()}`,
				helloApiURL,
			),
		).ok(({ jobs }) => {
			setJobs(jobs.sort(byTimestamp))
		})
	}, [fingerprint])

	return (
		<FOTAContext.Provider
			value={{
				jobs,
				scheduleJob: (upgradePath, target) =>
					validatingFetch(FOTAJob)(
						new URL(
							`./device/${device.id}/fota/${target}?${new URLSearchParams({ fingerprint }).toString()}`,
							helloApiURL,
						),
						{
							upgradePath,
						},
					).ok((job) => {
						setJobs((jobs) => [job, ...jobs].sort(byTimestamp))
					}),
				needsFwUpdate,
				fwUpdateSeverity:
					needsFwUpdate && model.firmware.important
						? FirmwareUpdateSeverity.Important
						: FirmwareUpdateSeverity.Normal,
				needsMfwUpdate,
				mfwUpdateSeverity:
					needsMfwUpdate && model.mfw.important
						? FirmwareUpdateSeverity.Important
						: FirmwareUpdateSeverity.Normal,
				appV,
				modV,
				fwTypes,
			}}
		>
			{children}
		</FOTAContext.Provider>
	)
}

export const Consumer = FOTAContext.Consumer

export const useFOTA = () => useContext(FOTAContext)

const byTimestamp = (
	{ timestamp: a }: Static<typeof FOTAJob>,
	{ timestamp: b }: Static<typeof FOTAJob>,
) => b.localeCompare(a)

import type { Model } from '#content/models/types.js'
import { validatingFetch, type ResultHandlers } from '#utils/validatingFetch.js'
import { type LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/lwm2m'
import {
	FOTAJobExecution,
	FOTAJobExecutions,
} from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type Device = {
	id: string
	model: Model
}

export type Configuration = {
	updateIntervalSeconds: number
	gnssEnabled: boolean
}

export const FOTAContext = createContext<{
	jobs: Array<Static<typeof FOTAJobExecution>>
	scheduleJob: (bundleId: string) => ResultHandlers<typeof FOTAJobExecution>
}>({
	jobs: [],
	scheduleJob: () => {
		throw new Error(`Not implemented!`)
	},
})

export type ListenerFn = (instance: LwM2MObjectInstance) => unknown

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
	const [jobs, setJobs] = useState<Array<Static<typeof FOTAJobExecution>>>([])

	useEffect(() => {
		validatingFetch(FOTAJobExecutions)(
			new URL(
				`./device/${device.id}/fota/jobs?${new URLSearchParams({ fingerprint }).toString()}`,
				helloApiURL,
			),
		).ok(({ jobs }) => {
			setJobs(jobs)
		})
	}, [fingerprint])

	return (
		<FOTAContext.Provider
			value={{
				jobs,
				scheduleJob: (bundleId) =>
					validatingFetch(FOTAJobExecution)(
						new URL(
							`./device/${device.id}/fota?${new URLSearchParams({ fingerprint }).toString()}`,
							helloApiURL,
						),
						{
							bundleId,
						},
					).ok((job) => {
						setJobs((jobs) => [job, ...jobs])
					}),
			}}
		>
			{children}
		</FOTAContext.Provider>
	)
}

export const Consumer = FOTAContext.Consumer

export const useFOTA = () => useContext(FOTAContext)

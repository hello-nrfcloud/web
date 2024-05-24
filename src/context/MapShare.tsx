import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useParameters } from '#context/Parameters.js'
import { validatingFetch } from '#utils/validatingFetch.js'
import { PublicDevice } from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'
import { useFingerprint } from '#context/Fingerprint.js'

export const MapShareContext = createContext<{
	shared?: Static<typeof PublicDevice>
	refresh: () => void
}>({ refresh: () => undefined })
const fetchDevice = validatingFetch(PublicDevice)

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { fingerprint } = useFingerprint()
	const { onParameters } = useParameters()

	const [shared, setShared] = useState<Static<typeof PublicDevice>>()

	const fetchPublicDevice = (fingerprint: string) => {
		onParameters(({ sharingStatusAPIURL }) => {
			fetchDevice(
				new URL(
					`?${new URLSearchParams({ fingerprint }).toString()}`,
					sharingStatusAPIURL,
				),
			).ok((publicDevice) => {
				console.log(`[MapShare]`, publicDevice)
				setShared(publicDevice)
			})
		})
	}

	useEffect(() => {
		if (fingerprint === null) return
		fetchPublicDevice(fingerprint)
	}, [fingerprint])

	return (
		<MapShareContext.Provider
			value={{
				shared,
				refresh: () => {
					if (fingerprint !== null) fetchPublicDevice(fingerprint)
				},
			}}
		>
			{children}
		</MapShareContext.Provider>
	)
}

export const Consumer = MapShareContext.Consumer

export const useMapShare = () => useContext(MapShareContext)

import { isDeviceInformation, toDeviceInformation } from '#proto/lwm2m.js'
import { createContext } from 'preact'
import type { PropsWithChildren } from 'preact/compat'
import { useCallback, useContext, useEffect, useState } from 'preact/hooks'
import { useDevice } from './Device.js'
import { identifyIssuer, type Issuer } from 'e118-iin-list'
import { useParameters } from './Parameters.js'
import { getSIMDetails } from '#api/getSIMDetails.js'

export type SIMUsage = {
	used: number
	total: number
	/**
	 * As float, 0-1
	 */
	availablePercent: number
	ts: Date
	availableBytes: number
}

type SIMUsageContextType =
	| {
			iccid: undefined
			lastUpdated: undefined
			issuer: undefined
			usage: undefined
	  }
	| {
			iccid: string
			lastUpdated: Date
			issuer: undefined
			usage: undefined
	  }
	| {
			iccid: string
			lastUpdated: Date
			issuer: Issuer
			usage: undefined
	  }
	| {
			iccid: string
			lastUpdated: Date
			issuer: Issuer
			usage: SIMUsage
	  }

export const SIMUsageContext = createContext<SIMUsageContextType>({
	iccid: undefined,
	lastUpdated: undefined,
	issuer: undefined,
	usage: undefined,
})

const knownIssuers = new Map([
	[894573, 'Onomondo'],
	[894446, 'Wireless Logic'],
])

export const Provider = (props: PropsWithChildren) => {
	const { onParameters } = useParameters()
	const [usage, setUsage] = useState<SIMUsage | undefined>(undefined)
	const [issuer, setIssuer] = useState<Issuer | undefined>(undefined)
	const [nextFetch, setNextFetch] = useState<number | undefined>(undefined)
	const { reported } = useDevice()
	const { iccid, ts } =
		Object.values(reported)
			.filter(isDeviceInformation)
			.map(toDeviceInformation)[0] ?? {}

	const update = useCallback(() => {
		if (issuer === undefined) return
		if (iccid === undefined) return
		if (!knownIssuers.has(issuer.iin)) return
		onParameters(({ simDetailsAPIURL }) => {
			getSIMDetails(new URL(simDetailsAPIURL))(iccid)
				.ok(({ totalBytes, usedBytes, timestamp }, { cacheControl }) => {
					setUsage({
						used: usedBytes,
						total: totalBytes,
						availablePercent: 1 - usedBytes / totalBytes,
						availableBytes: totalBytes - usedBytes,
						ts: new Date(timestamp),
					})
					if (cacheControl.public && cacheControl.maxAge !== undefined) {
						setNextFetch(Date.now() + cacheControl.maxAge * 1000)
					} else {
						setNextFetch(Date.now() + 300 * 1000)
					}
				})
				.problem((problem, response) => {
					console.error(`[SIMDetails]`, problem, response)
					if (
						response?.response.status === 409 &&
						response.cacheControl?.maxAge !== undefined
					) {
						setNextFetch(Date.now() + response.cacheControl.maxAge * 1000)
					}
				})
		})
	}, [issuer, iccid])

	// Update usage once we have iccid and issuer
	useEffect(() => {
		if (iccid === undefined) return
		if (issuer === undefined) return
		update()
	}, [iccid, issuer])

	// Update issuer once we have iccid
	useEffect(() => {
		if (iccid === undefined) return
		setIssuer(identifyIssuer(iccid))
	}, [iccid])

	// Schedule next fetch
	useEffect(() => {
		if (nextFetch === undefined) return
		console.log('nextFetch', new Date(nextFetch))
		console.debug(
			`[SIMDetails]`,
			`next fetch in ${Math.ceil((nextFetch - Date.now()) / 1000 / 60)} minutes`,
			`(${new Date(nextFetch).toISOString()})`,
		)
		const t = setTimeout(update, nextFetch - Date.now())
		return () => {
			clearTimeout(t)
		}
	}, [iccid, issuer, nextFetch])

	return (
		<SIMUsageContext.Provider
			value={
				{
					usage,
					iccid,
					issuer,
					lastUpdated: [usage?.ts, ts].filter(isNotUndefined).sort(byDate)[0],
				} as SIMUsageContextType
			}
		>
			{props.children}
		</SIMUsageContext.Provider>
	)
}

export const Consumer = SIMUsageContext.Consumer

export const useSIMDetails = () => useContext(SIMUsageContext)

const isNotUndefined = <T,>(x: T | undefined): x is T => x !== undefined
const byDate = (a: Date, b: Date) => b.getTime() - a.getTime()

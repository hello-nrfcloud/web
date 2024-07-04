import { getSIMDetails } from '#api/getSIMDetails.js'
import { useParameters } from '#context/Parameters.js'
import { type Issuer, identifyIssuer } from 'e118-iin-list'
import type { VNode } from 'preact'
import { useEffect, useState, useCallback } from 'preact/hooks'

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

export const knownIssuers = new Map([
	[894573, 'Onomondo'],
	[894446, 'Wireless Logic'],
])

export const SIMDetails = ({
	iccid,
	children,
}: {
	iccid: string
	children: (details: {
		issuer?: Issuer
		usage?: SIMUsage
	}) => VNode<any> | null
}): VNode<any> | null => {
	const { onParameters } = useParameters()
	const [issuer, setIssuer] = useState<Issuer | undefined>(undefined)
	const [usage, setUsage] = useState<SIMUsage | undefined>(undefined)
	const [nextFetch, setNextFetch] = useState<number | undefined>(undefined)

	const update = useCallback(() => {
		if (issuer === undefined) return
		if (iccid === undefined) return
		if (!knownIssuers.has(issuer.iin)) return
		if (knownIssuers.get(issuer.iin) === 'Onomondo') {
			onParameters(({ simDetailsAPIURL }) => {
				getSIMDetails(new URL(simDetailsAPIURL))(iccid).ok(
					({ totalBytes, usedBytes, timestamp }, { cacheControl }) => {
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
					},
				)
			})
		}
	}, [issuer, iccid])

	useEffect(() => {
		if (iccid === undefined) return
		setIssuer(identifyIssuer(iccid))
	}, [iccid])

	useEffect(() => {
		if (issuer === undefined) return
		if (iccid === undefined) return
		update()
	}, [issuer, iccid])

	useEffect(() => {
		if (nextFetch === undefined) return
		console.debug(
			`[SIMDetails]`,
			`next fetch in`,
			Math.floor((nextFetch - Date.now()) / 1000),
			'seconds',
		)
		const t = setTimeout(update, nextFetch - Date.now())
		return () => {
			clearTimeout(t)
		}
	}, [iccid, issuer, nextFetch])

	return children({ issuer, usage })
}
